Getting Started Guide

To run this website locally on your device, please follow the steps below to install the required tools:

1. Install Node.js and npm

Download and install the latest LTS version of Node.js

npm (Node Package Manager) comes bundled with Node.js


2. Install a Code Editor

We recommend using Visual Studio Code (VS Code) for easy editing and terminal access.


3. Clone the Project

Open a terminal or command prompt and run:

git clone https://github.com/yourusername/your-project-name.git
cd your-project-name


4. Install Project Dependencies

In your project folder, run:

npm install


5. Start the Development Server

Once installation is done, start the server with:

npm run dev

Open your browser and go to http://localhost:5173 (or the URL shown in terminal)


6. (Optional) Install Supabase CLI

If you're using Supabase for backend:

Install it via npm:

npm install -g supabase

Or follow the official Supabase CLI Installation Guide


## Park Guide Booking System

The park guide booking system allows visitors to book tours with park guides. This feature includes:

1. Viewing park guides on the homepage and dedicated guides page
2. Booking a specific guide on a specific date
3. Guide notification system for new bookings
4. Guide booking management interface

### Database Setup

To set up the booking system database, run the following SQL script in the Supabase SQL editor:

```sql
-- Execute the setup_booking_system.sql script in the Supabase SQL editor
```

### Usage

- Visitors can view park guides on the homepage or the guides page
- Click "Book this Guide" to book a specific guide
- Fill in the booking form with name, contact number, date, and optional message
- Park guides can view and manage their bookings in the "My Bookings" section
- Guides receive notifications when new bookings are made




