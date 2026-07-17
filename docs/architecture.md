# Periscope Dashboard — Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Browser]
        subgraph "React Application"
            Entry[main.tsx]
            App[App.tsx]
            subgraph "Providers"
                BrowserRouter[BrowserRouter]
                AuthProvider[AuthProvider]
                ToastProvider[ToastProvider]
            end
            subgraph "Pages"
                LoginPage[LoginPage]
                TotpLoginPage[TotpLoginPage]
                DashboardPage[DashboardPage]
                BusinessesPage[BusinessesPage]
                BusinessDetailPage[BusinessDetailPage]
                RevenuePage[RevenuePage]
                UsersPage[UsersPage]
                SupportPage[SupportPage]
                SystemHealthPage[SystemHealthPage]
                AuditLogPage[AuditLogPage]
                SettingsPage[SettingsPage]
                AdminsPage[AdminsPage]
            end
            subgraph "Components"
                AppShell[AppShell]
                Layout[Layout Components]
                UI[UI Components]
            end
        end
    end

    subgraph "State Management"
        AuthContext[Auth Context]
        LocalStorage[localStorage]
    end

    subgraph "API Layer"
        APIClient[api/client.ts]
        MockData[lib/mockData.ts]
    end

    subgraph "Backend Services"
        AuthAPI[Auth API]
        DashboardAPI[Dashboard API]
        BusinessAPI[Business API]
        SubscriptionAPI[Subscription API]
    end

    Browser --> Entry
    Entry --> App
    App --> BrowserRouter
    BrowserRouter --> AuthProvider
    AuthProvider --> ToastProvider
    ToastProvider --> LoginPage
    ToastProvider --> TotpLoginPage
    ToastProvider --> AppShell
    AppShell --> Pages
    LoginPage --> AuthAPI
    TotpLoginPage --> AuthAPI
    DashboardPage --> DashboardAPI
    BusinessesPage --> BusinessAPI
    BusinessDetailPage --> BusinessAPI
    RevenuePage --> SubscriptionAPI
    UsersPage --> BusinessAPI
    SupportPage --> BusinessAPI
    SystemHealthPage --> DashboardAPI
    AuditLogPage --> DashboardAPI
    SettingsPage --> AuthAPI
    AdminsPage --> AuthAPI
    APIClient --> AuthAPI
    APIClient --> DashboardAPI
    APIClient --> BusinessAPI
    APIClient --> SubscriptionAPI
```

## Component Hierarchy

```mermaid
graph TB
    subgraph "Application Structure"
        Root[Root]
        Root --> Router[BrowserRouter]
        Router --> AuthProvider[AuthProvider]
        AuthProvider --> ToastProvider[ToastProvider]
        ToastProvider --> Routes[Routes]
    end

    subgraph "Route Groups"
        Routes --> PublicRoutes[Public Routes]
        Routes --> ProtectedRoutes[Protected Routes]
    end

    subgraph "Public Routes"
        PublicRoutes --> LoginPage[LoginPage]
        PublicRoutes --> TotpLoginPage[TotpLoginPage]
    end

    subgraph "Protected Routes"
        ProtectedRoutes --> ProtectedShell[ProtectedShell]
        ProtectedShell --> RequireAuth[RequireAuth]
        RequireAuth --> AppShell[AppShell]
        AppShell --> PageContent[Page Content]
    end

    subgraph "Page Content with Permissions"
        PageContent --> DashboardPage[DashboardPage]
        PageContent --> BusinessesPage[BusinessesPage]
        PageContent --> BusinessDetailPage[BusinessDetailPage]
        PageContent --> RevenuePage[RevenuePage]
        PageContent --> UsersPage[UsersPage]
        PageContent --> SupportPage[SupportPage]
        PageContent --> SystemHealthPage[SystemHealthPage]
        PageContent --> AuditLogPage[AuditLogPage]
        PageContent --> SettingsPage[SettingsPage]
        PageContent --> AdminsPage[AdminsPage]
    end

    subgraph "AppShell Components"
        AppShell --> Sidebar[Sidebar]
        AppShell --> Topbar[Topbar]
        AppShell --> MainContent[Main Content]
        Sidebar --> Navigation[Navigation]
        Sidebar --> UserProfile[User Profile]
        Topbar --> Search[Search]
        Topbar --> Notifications[Notifications]
        Topbar --> UserMenu[User Menu]
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Browser as Browser
    participant React as React App
    participant AuthContext as Auth Context
    participant APIClient as API Client
    participant Backend as Backend API
    participant Storage as localStorage

    User->>Browser: Navigate to app
    Browser->>React: Load main.tsx
    React->>AuthContext: Check stored token
    AuthContext->>Storage: Read token
    Storage-->>AuthContext: Return token or null

    alt No token
        React->>User: Redirect to /login
        User->>React: Enter credentials
        React->>APIClient: POST /auth/login
        APIClient->>Backend: Send credentials
        Backend-->>APIClient: Return token or MFA required
        APIClient-->>React: Return response
        alt MFA required
            React->>User: Redirect to /login/totp
            User->>React: Enter TOTP code
            React->>APIClient: POST /auth/login/totp
            APIClient->>Backend: Verify TOTP
            Backend-->>APIClient: Return token
            APIClient-->>React: Return response
        end
        React->>AuthContext: Store token and user
        AuthContext->>Storage: Save to localStorage
    end

    User->>React: Access protected page
    React->>AuthContext: Check permission
    AuthContext-->>React: Permission granted
    React->>APIClient: GET /internal/resource
    APIClient->>Backend: Request with Bearer token
    Backend-->>APIClient: Return data
    APIClient-->>React: Return response
    React->>User: Display data

    User->>React: Logout
    React->>AuthContext: Clear token
    AuthContext->>Storage: Remove from localStorage
    React->>User: Redirect to /login
```

## API Layer Architecture

```mermaid
graph TB
    subgraph "API Client (api/client.ts)"
        APIClient[API Client]
        Request[request function]
        AuthToken[Token Management]
        CorrelationID[Correlation ID]
    end

    subgraph "API Endpoints"
        AuthEndpoints[Auth Endpoints]
        DashboardEndpoints[Dashboard Endpoints]
        BusinessEndpoints[Business Endpoints]
        SubscriptionEndpoints[Subscription Endpoints]
    end

    subgraph "Mock Data Layer"
        MockData[lib/mockData.ts]
        MockDashboard[Mock Dashboard]
        MockBusinesses[Mock Businesses]
        MockSubscriptions[Mock Subscriptions]
        MockUsers[Mock Users]
        MockNotifications[Mock Notifications]
    end

    subgraph "Backend API"
        AuthAPI[Auth Service]
        DashboardAPI[Dashboard Service]
        BusinessAPI[Business Service]
        SubscriptionAPI[Subscription Service]
    end

    APIClient --> Request
    Request --> AuthToken
    Request --> CorrelationID
    AuthEndpoints --> AuthAPI
    DashboardEndpoints --> DashboardAPI
    BusinessEndpoints --> BusinessAPI
    SubscriptionEndpoints --> SubscriptionAPI
    MockData --> MockDashboard
    MockData --> MockBusinesses
    MockData --> MockSubscriptions
    MockData --> MockUsers
    MockData --> MockNotifications
```

## State Management

```mermaid
graph TB
    subgraph "React Contexts"
        AuthContext[Auth Context]
        ToastContext[Toast Context]
    end

    subgraph "Auth State"
        Token[Token]
        User[User]
        Permissions[Permissions]
    end

    subgraph "Toast State"
        Toasts[Toasts Array]
        ToastMethod[Toast Method]
    end

    subgraph "Local Storage"
        TokenStorage[periscope_token]
        UserStorage[periscope_user]
    end

    AuthContext --> Token
    AuthContext --> User
    AuthContext --> Permissions
    Token --> TokenStorage
    User --> UserStorage
    ToastContext --> Toasts
    ToastContext --> ToastMethod

    subgraph "Component Usage"
        Pages[Pages]
        Components[Components]
    end

    Pages --> AuthContext
    Pages --> ToastContext
    Components --> AuthContext
    Components --> ToastContext
```

## Routing & Permissions

```mermaid
graph TB
    subgraph "Route Definitions"
        Root[/: Root]
        Login[/login]
        TotpLogin[/login/totp]
        Dashboard[/dashboard]
        Businesses[/businesses]
        BusinessDetail[/businesses/:id]
        Revenue[/revenue]
        Subscriptions[/subscriptions]
        Users[/users]
        Support[/support]
        SystemHealth[/system-health]
        AuditLog[/audit-log]
        Settings[/settings]
        Admins[/settings/admins]
    end

    subgraph "Permission Requirements"
        SystemRead[system.read]
        BusinessRead[business.read]
        BillingRead[billing.read]
        SubscriptionRead[subscription.read]
        UserRead[user.read]
        SupportRead[support.read]
        SystemWrite[system.write]
    end

    subgraph "Route Permissions"
        Dashboard --> SystemRead
        Revenue --> BillingRead
        Subscriptions --> SubscriptionRead
        Users --> UserRead
        Support --> SupportRead
        SystemHealth --> SystemRead
        AuditLog --> SystemRead
        Admins --> SystemWrite
    end

    subgraph "Auth Flow"
        Root --> Login
        Root --> TotpLogin
        Login --> Dashboard
        TotpLogin --> Dashboard
        Dashboard --> Businesses
        Dashboard --> BusinessDetail
        Dashboard --> Revenue
        Dashboard --> Subscriptions
        Dashboard --> Users
        Dashboard --> Support
        Dashboard --> SystemHealth
        Dashboard --> AuditLog
        Dashboard --> Settings
        Settings --> Admins
    end
```

## Component Structure

```mermaid
graph TB
    subgraph "UI Components"
        KpiCard[KpiCard]
        StatusBadge[StatusBadge]
        AppTag[AppTag]
        Skeleton[Skeleton]
        OtpInput[OtpInput]
        Toast[Toast]
    end

    subgraph "Layout Components"
        AppShell[AppShell]
        Sidebar[Sidebar]
        Topbar[Topbar]
        MainContent[Main Content]
    end

    subgraph "Page Components"
        LoginPage[LoginPage]
        TotpLoginPage[TotpLoginPage]
        DashboardPage[DashboardPage]
        BusinessesPage[BusinessesPage]
        BusinessDetailPage[BusinessDetailPage]
        RevenuePage[RevenuePage]
        UsersPage[UsersPage]
        SupportPage[SupportPage]
        SystemHealthPage[SystemHealthPage]
        AuditLogPage[AuditLogPage]
        SettingsPage[SettingsPage]
        AdminsPage[AdminsPage]
        ErrorPages[Error Pages]
    end

    subgraph "Hook Components"
        UseAuth[useAuth]
    end

    subgraph "Type Definitions"
        Types[TypeScript Types]
    end

    AppShell --> Sidebar
    AppShell --> Topbar
    AppShell --> MainContent
    Sidebar --> Navigation
    Topbar --> Search
    Topbar --> Notifications
    Topbar --> UserMenu
    MainContent --> PageContent

    LoginPage --> UseAuth
    TotpLoginPage --> UseAuth
    DashboardPage --> KpiCard
    BusinessesPage --> StatusBadge
    BusinessDetailPage --> StatusBadge
    RevenuePage --> KpiCard
    UsersPage --> StatusBadge
    SupportPage --> StatusBadge
    SystemHealthPage --> KpiCard
    AuditLogPage --> StatusBadge
    SettingsPage --> OtpInput
    AdminsPage --> StatusBadge
    ErrorPages --> StatusBadge

    AllComponents --> Types
```

## Tech Stack

```mermaid
graph TB
    subgraph "Frontend"
        React[React 19]
        TypeScript[TypeScript]
        Vite[Vite]
        ReactRouter[React Router DOM]
    end

    subgraph "Styling"
        TailwindCSS[Tailwind CSS]
        PostCSS[PostCSS]
        Autoprefixer[Autoprefixer]
    end

    subgraph "UI Libraries"
        LucideReact[Lucide React]
        Recharts[Recharts]
        CLSX[clsx]
    end

    subgraph "Build Tools"
        OxLint[oxlint]
        TypeScriptCompiler[TypeScript Compiler]
    end

    subgraph "Dependencies"
        ReactDom[React DOM]
    end

    React --> ReactDom
    React --> ReactRouter
    Vite --> React
    TypeScript --> Vite
    TailwindCSS --> PostCSS
    PostCSS --> Autoprefixer
    LucideReact --> React
    Recharts --> React
    CLSX --> React
    OxLint --> TypeScript
    TypeScriptCompiler --> TypeScript
```

## Data Models

```mermaid
erDiagram
    USER ||--o{ AUTH_TOKEN : has
    USER ||--o{ PERMISSION : has
    USER ||--o{ ROLE : has

    BUSINESS ||--o{ APPLICATION : uses
    BUSINESS ||--o{ SUBSCRIPTION : has
    BUSINESS ||--o{ USER : belongs_to

    APPLICATION ||--o{ SUBSCRIPTION : offers
    APPLICATION ||--o{ HEALTH_STATUS : has

    SUBSCRIPTION ||--o{ PAYMENT : generates
    SUBSCRIPTION ||--o{ PLAN : follows

    USER {
        string email
        string role
        array permissions
    }

    BUSINESS {
        string id
        string name
        string status
        array applications
        number mrr
        number users
    }

    APPLICATION {
        string key
        string name
        boolean unavailable
        number businesses
        number activeBusinesses
        number users
        number mrr
        number arr
        number activeSubscriptions
        number failedPayments
        number todaySignups
        number todayRevenue
        string systemHealth
        number avgResponseTimeMs
    }

    SUBSCRIPTION {
        string id
        string businessId
        string businessName
        string plan
        string status
        number mrr
        string renewsAt
        string cancelledAt
        string createdAt
    }

    HEALTH_STATUS {
        string systemHealth
        number avgResponseTimeMs
        number uptime
        number errorRate
    }
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Development Server]
        MockData[Mock Data]
        LocalStorage[Local Storage]
    end

    subgraph "Production"
        Vercel[Vercel]
        StaticFiles[Static Files]
        CDN[CDN]
    end

    subgraph "Backend Services"
        Gateway[API Gateway]
        AuthService[Auth Service]
        DashboardService[Dashboard Service]
        BusinessService[Business Service]
        SubscriptionService[Subscription Service]
    end

    subgraph "Data Sources"
        Database[Database]
        Cache[Cache]
        MessageQueue[Message Queue]
    end

    Dev --> MockData
    Dev --> LocalStorage
    Vercel --> StaticFiles
    Vercel --> CDN
    StaticFiles --> Browser[Browser]
    CDN --> Browser
    Browser --> Gateway
    Gateway --> AuthService
    Gateway --> DashboardService
    Gateway --> BusinessService
    Gateway --> SubscriptionService
    AuthService --> Database
    DashboardService --> Database
    DashboardService --> Cache
    BusinessService --> Database
    SubscriptionService --> Database
    SubscriptionService --> MessageQueue
```

## Error Handling Flow

```mermaid
sequenceDiagram
    participant User as User
    participant React as React App
    participant APIClient as API Client
    participant Backend as Backend API
    participant Toast as Toast System

    User->>React: Perform action
    React->>APIClient: Make API request
    APIClient->>Backend: Send request with token

    alt Success (2xx)
        Backend-->>APIClient: Return success response
        APIClient-->>React: Return data
        React->>User: Display success
        React->>Toast: Show success toast
        Toast->>User: Display success notification
    end

    alt Error (4xx/5xx)
        Backend-->>APIClient: Return error response
        APIClient-->>React: Throw error
        React->>Toast: Show error toast
        Toast->>User: Display error notification
        React->>User: Show error state
    end

    alt Network Error
        APIClient-->>React: Throw network error
        React->>Toast: Show network error toast
        Toast->>User: Display network error
    end
```

## Authentication Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> LoginRequired: No token
    LoginRequired --> LoginPage: Redirect to /login
    LoginPage --> CredentialsEntered: Submit credentials
    CredentialsEntered --> MFARequired: MFA required
    CredentialsEntered --> Authenticated: MFA not required
    MFARequired --> TotpPage: Redirect to /login/totp
    TotpPage --> TotpEntered: Enter TOTP code
    TotpEntered --> Authenticated: Code valid
    TotpEntered --> MFARequired: Code invalid
    Authenticated --> TokenStored: Store token
    TokenStored --> Authenticated: Token valid
    TokenStored --> Unauthenticated: Token expired
    Authenticated --> Unauthenticated: Logout
    Unauthenticated --> [*]
```

## Permission Matrix

```mermaid
graph TB
    subgraph "Roles"
        SuperAdmin[Super Admin]
        Support[Support]
        Sales[Sales]
    end

    subgraph "Permissions"
        BusinessRead[business.read]
        BusinessWrite[business.write]
        BusinessDelete[business.delete]
        UserRead[user.read]
        UserWrite[user.write]
        BillingRead[billing.read]
        BillingWrite[billing.write]
        SubscriptionRead[subscription.read]
        CustomerRead[customer.read]
        SupportRead[support.read]
        SupportWrite[support.write]
        SystemRead[system.read]
        SystemWrite[system.write]
    end

    subgraph "Role Permissions"
        SuperAdmin --> BusinessRead
        SuperAdmin --> BusinessWrite
        SuperAdmin --> BusinessDelete
        SuperAdmin --> UserRead
        SuperAdmin --> UserWrite
        SuperAdmin --> BillingRead
        SuperAdmin --> BillingWrite
        SuperAdmin --> SubscriptionRead
        SuperAdmin --> CustomerRead
        SuperAdmin --> SupportRead
        SuperAdmin --> SupportWrite
        SuperAdmin --> SystemRead
        SuperAdmin --> SystemWrite

        Support --> BusinessRead
        Support --> UserRead
        Support --> SupportRead
        Support --> SupportWrite

        Sales --> BusinessRead
        Sales --> SubscriptionRead
        Sales --> BillingRead
        Sales --> CustomerRead
    end
```

## Summary

The Periscope Dashboard is a **React 19** single-page application built with **TypeScript** and **Vite**. It uses **React Router DOM** for client-side routing with **role-based access control (RBAC)**. The application follows a **component-based architecture** with:

- **Context-based state management** for authentication and toast notifications
- **API client layer** for backend communication with mock data support
- **Responsive design** using **Tailwind CSS** with a mobile-first approach
- **Permission-based routing** with protected routes and role-based access control
- **Modular component structure** with reusable UI components and layout components

The architecture supports both **development** (with mock data) and **production** (with real backend APIs) environments, making it scalable and maintainable for internal operations management.
