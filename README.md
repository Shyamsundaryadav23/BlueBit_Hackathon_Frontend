# Frontend Blue

This repository contains the frontend for BlueBit—a web application for managing groups and expenses. The application is built with React and Vite, and integrates with a Flask backend (using DynamoDB) via a REST API.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Group Management:** Create, view, and manage groups of users.
- **Expense Tracking:** Create and track expenses with receipt uploads.
- **Payment Processing:** Simulate payment processing with UPI and card options.
- **Real-time Notifications:** Email notifications for expense sharing.
- **Responsive Design:** Mobile-friendly interface with modern UI components.

## Technology Stack

- **Frontend:**  
  - React  
  - Vite  
  - Tailwind CSS  
  - Radix UI (Dialog, Tabs, etc.)
- **Backend:**  
  - Flask (Python)  
  - DynamoDB (AWS)  
  - JWT Authentication
- **Utilities:**  
  - Sonner for toast notifications  
  - Lucide React for icons

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/rupesh3433/frontend_blue.git
   cd frontend_blue
