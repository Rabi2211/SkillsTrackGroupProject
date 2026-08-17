# part 3

```nyiko
flowchart TD
    A[Learner signs in] --> B[Client-side: JS sends login request]
    B --> C[Firebase Authentication]
    C --> D[Client-side: session active, dashboard loads]
    D --> E[Client-side: JS validates input]
    E --> F[Firebase Realtime Database]
    F --> G[Client-side: JS updates DOM]
    G --> H[Learner sees new task]
```
