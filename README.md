# Calm Route Planner

Build a polished, production-quality web application called:
SAFE ROUTE
Women’s Safety-Scored Route Navigator
This is a frontend-first project. Build the complete responsive frontend with realistic mock data and a clean architecture that can later connect to a backend/API.
The product is a safety-aware navigation system. Unlike traditional navigation systems that primarily focus on distance, travel time and traffic, SafeRoute should help users compare alternative routes using safety-related factors and a clear safety score.
The core product experience is:
SOURCE → DESTINATION → GENERATE ROUTES → ANALYZE SAFETY → COMPARE ROUTES → SELECT A SAFER ROUTE
Do NOT make this look like a generic college project or a simple Google Maps clone.
It should look like a modern, premium safety-tech/navigation startup.
====================================================
TECHNOLOGY
====================================================
Use:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components where useful
- React Router
- Lucide icons
- Recharts for charts/visualizations where useful
Use reusable components and clean separation between pages, components, mock data and services.
Do not put the entire application into one file.
The frontend should be structured so a real backend and Google Maps API can be connected later.
For now, use realistic mock data.
====================================================
BRAND
====================================================
Brand name:
SafeRoute
Main tagline:
"Navigate safer. Travel smarter."
Supporting message:
"Compare routes based on safety, distance and travel time — and choose the journey that feels right for you."
Brand personality:
- Trustworthy
- Modern
- Calm
- Intelligent
- Safety-focused
- Professional
Do NOT make the design overly feminine, childish, cartoonish or overly red.
Use a sophisticated visual system:
- Deep navy / dark blue as primary
- White
- Soft gray backgrounds
- Green for safe
- Amber for moderate risk
- Red for high risk
- Subtle gradients
- Rounded cards
- Soft shadows
- Clean typography
- Strong spacing and hierarchy
Use red only for actual risk/emergency states.
====================================================
GLOBAL UX
====================================================
The application must feel like a real navigation product.
Use:
- Smooth page transitions
- Subtle hover animations
- Loading states
- Skeleton loaders
- Empty states
- Error states
- Toast notifications
- Tooltips
- Confirmation dialogs
- Responsive layouts
- Accessible buttons and forms
- Proper focus states
Avoid excessive animation.
Keep the interface clean and fast.
====================================================
APPLICATION STRUCTURE
====================================================
Create these routes/pages:
PUBLIC:
/
Landing Page
/how-it-works
How It Works
/safety
Safety & Methodology
/about
About SafeRoute
/login
Login
/signup
Sign Up
APP:
/dashboard
Dashboard
/route-planner
Plan a Route
/routes
Route Comparison
/routes/:id
Route Safety Details
/safety-map
Safety Map
/saved-routes
Saved Routes
/recent-trips
Recent Trips
/emergency
Emergency / SOS
/notifications
Notifications
/profile
Profile
/settings
Settings
====================================================
1. LANDING PAGE
====================================================
Create a premium landing page.
NAVBAR:
Left:
SafeRoute logo with shield + location pin concept.
Center/desktop navigation:
- Home
- How It Works
- Safety
- About
Right:
- Log In
- Get Started
HERO:
Large headline:
"Your destination matters.
So does how you get there."
Supporting text:
"SafeRoute helps you compare routes using safety, distance and travel time — so you can make more informed travel decisions."
Buttons:
"Plan a Safe Route"
"How It Works"
Hero visual:
Create a beautiful map-style product preview.
It should show:
- A destination
- Current location
- Multiple route lines
- Green safe segments
- Yellow moderate-risk segments
- Red high-risk segments
- Safety score card
- Route information card
Do NOT require a real Maps API for this initial version. Create a convincing interactive map-style mockup that can later be replaced by Google Maps.
Below the hero, create:
SAFETY SCORE CARD
Example:
92 / 100
Excellent
"Overall Route Safety"
Use a circular/radial score visualization.
ROUTE PREVIEW:
Show 3 route cards:
Safest Route
92/100
6.2 km
24 min
Low Risk
Balanced Route
76/100
5.4 km
20 min
Medium Risk
Fastest Route
58/100
4.8 km
17 min
High Risk
Highlight "Safest Route".
HOW IT WORKS:
Step 1:
Enter your destination
Step 2:
Generate available routes
Step 3:
Analyze safety factors
Step 4:
Compare routes and choose
SAFETY FACTORS:
Create cards for:
- Lighting
- Crime/Risk Level
- Public Activity
- Road/Area Conditions
- Safe Locations
- Risk-Prone Segments
WHY SAFEROUTE:
Explain that traditional navigation focuses mainly on:
- Distance
- Time
- Traffic
SafeRoute adds:
- Safety scoring
- Route risk comparison
- Safer route visualization
FINAL CTA:
"Ready to travel with more confidence?"
Button:
"Plan a Safe Route"
FOOTER:
SafeRoute
Home
How It Works
Safety
About
Privacy
Terms
Contact
====================================================
2. HOW IT WORKS
====================================================
Create a clean explanatory page.
Show the complete flow:
1. Select source
2. Select destination
3. Generate available routes
4. Analyze safety factors
5. Calculate safety score
6. Compare routes
7. Choose the preferred route
Create a visual process timeline.
Explain that the system considers safety-related factors alongside travel convenience.
====================================================
3. SAFETY & METHODOLOGY
====================================================
Create a dedicated safety explanation page.
Explain the concept of the Safety Score.
Example:
Safety Score
92 / 100
Breakdown:
Lighting: 90%
Public Activity: 95%
Crime/Risk: 88%
Road Conditions: 91%
Safe Locations: 94%
IMPORTANT:
Do not claim that these are real crime statistics.
Clearly label the current values as sample/mock data until real safety data is connected.
Add:
"Safety scores are intended to provide a comparative indication between available routes based on the safety factors available to the system."
Create a clean visual explanation of how different factors contribute to the overall score.
====================================================
4. LOGIN / SIGNUP
====================================================
Create polished authentication screens.
LOGIN:
Email
Password
Show/hide password
Remember me
Forgot password
Login
Continue with Google
SIGNUP:
Full name
Email
Password
Confirm password
Terms checkbox
Create Account
Include validation.
Use mock authentication for now.
====================================================
5. APP DASHBOARD
====================================================
Create a professional dashboard layout.
DESKTOP:
Left sidebar.
Sidebar:
SafeRoute logo
Dashboard
Plan Route
Route History
Saved Routes
Safety Map
Emergency
Notifications
Bottom:
Profile
Settings
TOP BAR:
Search
Notifications
Profile avatar
MAIN:
Greeting:
"Good evening"
Hero route planner:
"Where are you going?"
From:
Current Location
To:
Enter destination
Button:
"Find Safe Routes"
STATISTICS:
Routes Planned
Safe Routes Chosen
Average Safety Score
Saved Places
RECENT TRIPS:
Show recent journeys.
SAVED PLACES:
Home
College
Work
Other
SAFETY OVERVIEW:
Show a summary of safety-related information.
====================================================
6. ROUTE PLANNER — MOST IMPORTANT SCREEN
====================================================
This is the core feature.
Create a beautiful full-screen navigation interface.
DESKTOP:
Left route planning panel.
Right large map.
MOBILE:
Map first or map as large upper section.
Controls and route cards below.
INPUTS:
From:
Current Location
To:
Enter destination
Add:
Swap locations button.
TRAVEL MODE:
Driving
Walking
Cycling
PRIORITY:
Create a clear priority control:
SAFETY ←──────────→ SPEED
Also allow:
Safest
Balanced
Fastest
OPTIONAL PREFERENCES:
☑ Prefer well-lit roads
☑ Prefer populated areas
☑ Avoid high-risk areas
☑ Avoid isolated areas
Primary CTA:
"Find Safest Routes"
When clicked, show a loading state:
"Analyzing available routes..."
Then display route results.
====================================================
7. MAP UI
====================================================
Create a convincing map interface.
Until Google Maps is connected, create a polished mock map.
The map should visually contain:
- Roads
- User location
- Destination
- Multiple route lines
- Safe areas
- Moderate-risk areas
- High-risk areas
- Safety markers
- Nearby safe locations
Map legend:
Green = Lower Risk
Yellow = Moderate Risk
Red = Higher Risk
Add map controls:
+
-
Current Location
Layers
The architecture must make it easy to replace this mock map with Google Maps later.
====================================================
8. ROUTE RESULTS
====================================================
After clicking "Find Safest Routes", show 3 route options.
Route cards must contain:
ROUTE 1:
Safest Route
Safety Score:
92 / 100
Excellent
Distance:
6.2 km
ETA:
24 min
Risk:
Low
Tags:
Well Lit
High Public Activity
Low Risk
Buttons:
View Details
Select Route
ROUTE 2:
Balanced Route
76 / 100
5.4 km
20 min
Medium Risk
ROUTE 3:
Fastest Route
58 / 100
4.8 km
17 min
High Risk
The safest route should be visually highlighted as:
"Recommended"
IMPORTANT:
Safety score must be visually more prominent than distance and ETA.
====================================================
9. ROUTE COMPARISON
====================================================
Create a dedicated route comparison page.
Show routes side by side or in a responsive comparison table.
Columns:
Route
Safety Score
Distance
ETA
Risk Level
Lighting
Public Activity
Risk Segments
Example:
Safest:
92
6.2 km
24 min
Low
90%
95%
1
Balanced:
76
5.4 km
20 min
Medium
72%
70%
2
Fastest:
58
4.8 km
17 min
High
48%
45%
4
Allow the user to select a route.
Make the comparison easy to understand at a glance.
====================================================
10. ROUTE SAFETY DETAILS
====================================================
Create a detailed route page.
Header:
Safest Route
92 / 100
Excellent
Large map.
Then:
WHY THIS ROUTE?
Show reasons:
✓ Better lighting
✓ Higher public activity
✓ Lower exposure to high-risk areas
✓ More nearby safe locations
SAFETY BREAKDOWN:
Lighting
90%
Public Activity
95%
Crime/Risk
88%
Road Conditions
91%
Safe Locations
94%
RISK SEGMENTS:
Show individual route segments:
Segment 1
Low Risk
Segment 2
Moderate Risk
Segment 3
Low Risk
Use map highlighting.
====================================================
11. SAFETY MAP
====================================================
Create a dedicated map page.
Full map with safety overlays.
Filters:
All
Risk
Lighting
Public Activity
Safe Places
Police Stations
Hospitals
Legend:
Low Risk
Moderate Risk
High Risk
Add a right-side information panel when a location/segment is selected.
====================================================
12. SAFE LOCATIONS
====================================================
Display nearby:
Police Stations
Hospitals
Pharmacies
Public Places
Transit Stations
Each card:
Name
Distance
Type
Button:
"View on Map"
Use mock locations.
====================================================
13. SAVED ROUTES
====================================================
Create a saved route management page.
Cards should show:
Route name
From
To
Safety score
Distance
ETA
Date saved
Actions:
Navigate
View Details
Delete
Include an empty state when there are no saved routes.
====================================================
14. RECENT TRIPS
====================================================
Create trip history.
Each item:
Date
From
To
Selected route
Safety score
Distance
Duration
Actions:
View Route
Save Route
====================================================
15. EMERGENCY / SOS
====================================================
Create an emergency page with an extremely clear UI.
Do not make it cluttered.
Large central SOS button.
Text:
"Emergency Assistance"
Sections:
Emergency Contacts
Current Location
Location Sharing
Quick Actions
Buttons:
Call Emergency Services
Share Current Location
Share Route
Contact Emergency Contact
Include:
Add Emergency Contact
For now, actions can be mock interactions.
IMPORTANT:
Do not automatically trigger real calls or location sharing.
Use confirmation dialogs.
====================================================
16. NOTIFICATIONS
====================================================
Create a notification center.
Examples:
"Your saved route is ready."
"Safety information has been updated."
"Location sharing is currently enabled."
Include:
Unread/read states
Timestamp
Notification icons
====================================================
17. PROFILE
====================================================
Profile page:
Profile photo placeholder
Full name
Email
Phone
Travel preferences
Safety preference
Emergency contacts
Edit Profile button.
====================================================
18. SETTINGS
====================================================
Create settings sections:
Account
Notifications
Location
Safety Preferences
Emergency
Privacy
Appearance
Include:
Dark Mode
Light Mode
Notification toggles.
Location permission UI.
Safety preference controls.
====================================================
19. RESPONSIVE DESIGN
====================================================
This is extremely important.
Desktop:
Sidebar + content.
Tablet:
Collapsible sidebar.
Mobile:
Bottom navigation:
Home
Plan
Routes
Safety
Profile
Map should become full-width.
Route cards should stack vertically.
Inputs should become mobile-friendly.
SOS access should remain easy.
Do NOT simply scale down the desktop layout.
Actually redesign layouts for mobile.
====================================================
20. COMPONENT SYSTEM
====================================================
Create reusable components such as:
Navbar
Sidebar
MobileBottomNav
MapView
RouteCard
SafetyScore
SafetyBreakdown
RiskBadge
LocationInput
RouteComparison
SafePlaceCard
StatCard
EmergencyButton
NotificationItem
Modal
Toast
LoadingState
EmptyState
Use consistent design tokens.
====================================================
21. MOCK DATA
====================================================
Create realistic mock data.
Routes:
Safest Route:
score 92
distance 6.2 km
duration 24 min
risk Low
Balanced Route:
score 76
distance 5.4 km
duration 20 min
risk Medium
Fastest Route:
score 58
distance 4.8 km
duration 17 min
risk High
Safety factors:
lighting
public activity
crime/risk
road conditions
safe locations
risk segments
Create enough mock data so every page feels populated.
====================================================
22. IMPORTANT PRODUCT LOGIC
====================================================
Do not make the UI imply that the fastest route is automatically the best route.
The product philosophy is:
SAFETY + DISTANCE + TIME
Safety should be the primary differentiator.
When displaying a recommended route, explain WHY it is recommended.
Example:
"Recommended because it has higher lighting coverage, greater public activity and fewer high-risk segments."
====================================================
23. VISUAL QUALITY REQUIREMENTS
====================================================
The finished UI must feel like a real startup product.
Use:
- Consistent 8px spacing system
- Modern typography
- Large headings
- Clean cards
- Subtle borders
- Soft shadows
- Premium buttons
- Consistent iconography
- Strong visual hierarchy
- Smooth but subtle interactions
Avoid:
- Excessive gradients
- Excessive glassmorphism
- Huge amounts of text
- Random colors
- Generic Bootstrap styling
- Overcrowded dashboards
- Too many cards
- Cartoon illustrations
- Fake statistics presented as real data
====================================================
24. ACCESSIBILITY
====================================================
Ensure:
- Good color contrast
- Keyboard navigation
- Accessible form labels
- Accessible buttons
- Focus states
- Tooltips where needed
- Semantic HTML
Do not use color alone to communicate risk.
For example:
Green + "Low Risk"
Yellow + "Moderate Risk"
Red + "High Risk"
====================================================
25. FILE / CODE ORGANIZATION
====================================================
Keep code maintainable.
Use:
components/
pages/
layouts/
data/
services/
hooks/
utils/
Separate:
UI components
mock data
route logic
safety logic
map logic
Do not duplicate components unnecessarily.
====================================================
26. BACKEND-READY ARCHITECTURE
====================================================
Although this is currently frontend-only, create service functions/interfaces so later we can connect:
- Route API
- Safety scoring API
- Location API
- User authentication
- Saved routes
- Emergency contacts
Do not hardcode API logic directly into UI components.
====================================================
27. FINAL FLOW TO PRIORITIZE
====================================================
The most important user journey is:
Landing Page
↓
Plan a Safe Route
↓
Enter Source
↓
Enter Destination
↓
Find Safest Routes
↓
Map + 3 Route Options
↓
Compare Safety Scores
↓
Open Route Details
↓
Understand WHY the route is safer
↓
Select Route
↓
Navigate
This flow should feel extremely polished.
====================================================
28. IMPORTANT
====================================================
Build the application completely, not just a landing page.
Start with the core navigation experience and then build the supporting pages.
The most important screens are:
1. Landing
2. Dashboard
3. Route Planner
4. Map
5. Route Results
6. Route Comparison
7. Route Safety Details
8. Safety Map
Make these screens especially polished.
The final application should demonstrate the project concept clearly:
SafeRoute helps users make safer and more informed route decisions by evaluating and comparing routes using safety-related factors alongside distance and travel time.
Use realistic sample/mock data where real APIs are unavailable, and clearly structure the code for future backend and Google Maps integration.
Do not stop after creating the homepage.
Build the complete frontend experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a060596b-b9e1-4c3a-8b26-05da50f890b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
