# Project Management System

A comprehensive Angular-based project management system with authentication, dashboard, and project management features.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## 🚀 Quick Start

### Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

1. **Node.js** (version 18 or higher recommended)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Angular CLI** (version 19.2.16 or compatible)
   - Install globally: `npm install -g @angular/cli@19.2.16`
   - Verify installation: `ng version`

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <github-repo-url>
   cd project-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser and navigate to** `http://localhost:4200/`

## 📁 Project Structure

```
src/app/
├── auth/                    # Authentication module
│   └── login/              # Login component
├── dashboard/              # Dashboard module
│   └── home/               # Home component
├── projects/               # Projects module
│   ├── project-create/     # Project creation
│   └── services/           # Project services
├── core/                   # Core module
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   └── services/           # Core services
└── shared/                 # Shared module
    ├── components/         # Reusable components
    │   ├── button/         # Button component
    │   ├── header/         # Header component
    │   ├── loader/         # Loading component
    │   ├── notification/   # Notification component
    │   └── sidebar/        # Sidebar component
    └── services/           # Shared services
```

## 🛠️ Available Scripts

- **Development server:** `npm start` or `ng serve`
- **Build:** `npm run build` or `ng build`


## 🎯 Key Features

- **User Authentication** - Secure login system
- **Project Management** - Create and manage projects
- **Dashboard** - Centralized project overview
- **Responsive Design** - Mobile-friendly interface
- **Shared Components** - Reusable UI components
- **Error Handling** - Comprehensive error management
- **Notifications** - User feedback system

## 🔧 Development

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🐛 Troubleshooting

If you encounter any issues:

1. **Clear npm cache:** `npm cache clean --force`
2. **Delete node_modules and reinstall:** 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Check Node.js version compatibility**
4. **Ensure Angular CLI version matches the project requirements**

## 📚 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
