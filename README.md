
# Education vs Crime: Data Visualization Dashboard

This repository contains the source code for an interactive data visualization dashboard that explores the correlation between education and crime rates in the United States.

You can view the live dashboard here -> https://heysachins.github.io/education-crime-us/

## Project Overview

The dashboard is designed to visualize and compare various educational and crime-related data across different states in the US. The aim is to identify patterns and correlations between education levels and crime rates, using multiple datasets and complex visualizations.

## Features

- **Map Visualizations**:
  - Two map visualizations are provided: one displaying educational attainment by state and another displaying crime rates by state. These maps are interactive, with custom tooltips that provide additional data through pie charts.

- **Horizontal Bar Chart**:
  - A horizontal bar chart compares education and crime rates, illustrating the relationship between higher educational attainment and lower crime rates across states.

- **Scatterplot**:
  - A scatterplot explores the correlation between education and crime, with a k-means clustering algorithm to group states based on similar characteristics.

- **Pie Charts**:
  - Custom pie charts are used as tooltips in the map visualizations, providing detailed breakdowns of educational attainment or crime statistics when hovering over specific states.

## Datasets Used

- **Crime Datasets**:
  - Crime data related to persons, property, and society, obtained from the US government’s public datasets.
  - CSV files: `crimeAgainstPersons.csv`, `crimeAgainstProperty.csv`, `crimeAgainstSociety.csv`

- **Education Datasets**:
  - Educational attainment data by age and race from the US Census Bureau.
  - CSV files: `educationalAttainmentByAge.csv`, `educationalAttainmentByRace.csv`

- **State Information**:
  - A dataset providing state-level information used to support the visualizations.
  - CSV file: `states.csv`

- **US Map**:
  - GeoJSON data used to draw the US map, fetched directly from a public URL.

## Technology Stack

- **HTML5** for the structure of the application.
- **CSS3** for styling and layout.
- **JavaScript (D3.js)** for creating dynamic and interactive data visualizations.

## Project Structure

- `index.html` - The main HTML page that hosts all the visualizations.
- `index.js` - JavaScript file containing the logic for data processing and visualization rendering.
- `index.css` - CSS file for styling the dashboard.
- `data/` - Folder containing all pre-processed CSV files used in the visualizations.

## How to Run the Project Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/education-vs-crime-dashboard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd education-vs-crime-dashboard
   ```

3. Open `index.html` in your web browser:

   ```bash
   open index.html
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
