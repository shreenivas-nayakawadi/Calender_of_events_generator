# Academic Calendar Generator

## Overview

A responsive web application for generating academic calendars with customizable events, holidays, and remarks. Designed for educational institutions to visualize semester schedules with working days, holidays, and special events.

## Features

- **Interactive Calendar Generation**:
  - Custom date ranges (14–16 weeks)
  - Semester and department selection
  - Automatic weekend detection

- **Event Management**:
  - Add holidays and special events
  - Color-coded event types
  - First/Third Saturday highlighting

- **Export Functionality**:
  - Save calendar as JPEG image
  - Printable format

- **Responsive Design**:
  - Works on desktop and mobile devices
  - Adaptive layout for different screen sizes

## Screenshots

> *(Replace these image links with actual paths once images are available)*

![Calendar View](screenshot-calendar.png)  
*Main calendar view with events and highlights*

![Setup Modal](screenshot-setup.png)  
*Setup modal for configuring the calendar*

![Remark Modal](screenshot-remark.png)  
*Remark modal for adding events and holidays*

## Technologies Used

- **Frontend**: React.js
- **Styling**: CSS Modules
- **Date Handling**: Custom date utilities
- **Export**: `html-to-image` library
- **UI Components**: Custom modal dialogs

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/academic-calendar.git
   cd academic-calendar
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

## Usage

1. **Setup Calendar**:

   * Click **"Generate Calendar"**
   * Choose **start and end dates** (must be 14–16 weeks apart)
   * Select **semester** and **department**
   * Submit to generate the calendar grid

2. **Add Events**:

   * Click **"Add Remark"**
   * Select a **date** and enter **event details**
   * Choose **event type**: Holiday or Regular Event
   * Save to add to calendar

3. **Export**:

   * Click **"Save"** to export calendar as JPEG
   * Image will be downloaded automatically


## Customization

To modify available departments or academic options:

1. **Edit `SetupModal.jsx`**:

   ```jsx
   <select name="dept" ...>
     <option value="Your Department">Department Name</option>
     <!-- Add or remove options as needed -->
   </select>
   ```

2. **Adjust semester range**:

   ```jsx
   <input
     type="number"
     name="sem"
     min="1" 
     max="8"  // Change this value as needed
     ...
   />
   ```

## Dependencies

* [react](https://www.npmjs.com/package/react): ^18.2.0
* [html-to-image](https://www.npmjs.com/package/html-to-image): ^1.11.11
* [react-component-export-image](https://www.npmjs.com/package/react-component-export-image): ^1.0.7



