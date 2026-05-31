# Architecture — Runtime View

> arc42 § 6 · focuses on the dynamic behaviour of the system at runtime.
> Static structure (modules, layers, dependencies) is described in the README.

---

## 1. Application Startup

The first significant runtime challenge is the **asynchronous initialization** of the SQLite-WASM engine. The browser must fetch and compile the WASM binary before any data layer call is valid.

```mermaid
sequenceDiagram
    participant Browser
    participant main.tsx
    participant Layout
    participant useAppStore
    participant database.ts
    participant CartSheet
    participant useCartStore

    Browser->>main.tsx: load app
    main.tsx->>Layout: render <Layout />
    Layout->>useAppStore: initialize()
    useAppStore->>database.ts: initDatabase() [async]
    note over database.ts: fetch sql-wasm.wasm (~1 MB)<br/>compile + instantiate WASM module<br/>create in-memory DB<br/>seed products, variants, cart tables
    database.ts-->>useAppStore: db ready
    useAppStore-->>Layout: isDbReady = true

    Layout->>CartSheet: render <CartSheet />
    CartSheet->>useCartStore: fetchItems() [useEffect]
    useCartStore->>database.ts: getDb()
    alt DB not yet ready
        database.ts-->>useCartStore: null → return early (no error)
    else DB ready
        useCartStore->>useCartStore: getContainer() → cartRepository.findAll()
        useCartStore-->>CartSheet: items loaded
    end
```

**Key design decision:** `useCartStore.fetchItems()` guards on `getDb() !== null` to silently absorb the race between React's initial render and WASM initialization. No retry logic is needed because subsequent user-triggered operations always run after the DB is ready.

---

## 2. Product Configurator Flow

When the user navigates to `/configurator/:id`, two independent async chains start in parallel: one fetches product data from SQLite, the other streams the GLB model from the network.

```mermaid
sequenceDiagram
    participant User
    participant ConfiguratorPage
    participant useConfiguratorStore
    participant container.ts
    participant SQLite
    participant Scene
    participant ConfigurableModel
    participant useGLTF

    User->>ConfiguratorPage: navigate to /configurator/:id
    ConfiguratorPage->>useConfiguratorStore: fetchInitialData(id) [useEffect]
    useConfiguratorStore->>container.ts: getContainer()
    container.ts->>SQLite: productRepository.findById(id)
    SQLite-->>useConfiguratorStore: product row
    container.ts->>SQLite: variantRepository.findByProductId(id)
    SQLite-->>useConfiguratorStore: variants[]
    useConfiguratorStore-->>ConfiguratorPage: product, variants, selectedVariant, price

    ConfiguratorPage->>Scene: render <Scene />
    Scene->>ConfigurableModel: render <ConfigurableModel />
    ConfigurableModel->>useGLTF: useGLTF(BASE_URL + product.model_path)
    note over useGLTF: async GLB fetch + parse<br/>(React Suspense boundary handles loading)
    useGLTF-->>ConfigurableModel: scene graph (THREE.Object3D)

    ConfigurableModel->>ConfigurableModel: useEffect — traverse scene
    note over ConfigurableModel: find mesh where child.name === selectedVariant.target_mesh<br/>clone MeshStandardMaterial<br/>set color to selectedVariant.color
    ConfigurableModel-->>User: coloured 3D model visible
```

---

## 3. Variant Selection

After the initial load, changing a variant is a **synchronous, zero-latency** operation — no network or DB call is needed.

```mermaid
sequenceDiagram
    participant User
    participant ConfiguratorPage
    participant useConfiguratorStore
    participant ConfigurableModel

    User->>ConfiguratorPage: click variant button
    ConfiguratorPage->>useConfiguratorStore: selectVariant(variantId)
    note over useConfiguratorStore: find variant in already-loaded variants[]<br/>compute price = base_price + price_modifier<br/>update selectedVariant + price in store
    useConfiguratorStore-->>ConfiguratorPage: re-render with new price
    useConfiguratorStore-->>ConfigurableModel: re-render (selectedVariant changed)
    ConfigurableModel->>ConfigurableModel: useEffect — traverse + recolour mesh
    ConfigurableModel-->>User: model colour updated instantly
```

---

## 4. Add to Cart

```mermaid
sequenceDiagram
    participant User
    participant ConfiguratorPage
    participant useCartStore
    participant container.ts
    participant SQLite
    participant CartSheet

    User->>ConfiguratorPage: click "Add to Cart"
    ConfiguratorPage->>useCartStore: addItem(productId, variantId)
    useCartStore->>container.ts: getContainer()
    container.ts->>SQLite: cartRepository.addItem(productId, variantId, qty)
    SQLite-->>useCartStore: ok
    useCartStore->>SQLite: cartRepository.findAll()
    SQLite-->>useCartStore: updated cart rows (with JOIN data)
    useCartStore-->>CartSheet: items[] updated → badge re-renders
    useCartStore-->>User: cart count visible in header
```
