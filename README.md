# The Aussie Dream Chaser

*Our mission* is to make a user friendly experience when searching for the Aussie dream.

*Our team* has designed an original product ‘the Aussie Dream Chaser’ tool that will find your ideal Aussie dream location.

*Our tool* harnesses this boundless country, by making searching for the ideal Australian Haven easy and accessible for the community.

## What are we building?
Our project is the development of a website application. This website aims to enable the general public to utilise open datasets to evaluate potential suburbs to relocate to, or visit for a holiday, based on community facilities in that area.

In addition, local government authorities can also benefit from the data captured by this application to evaluate the demand for certain public facilities. This will aid local councils in planning for future growth and development to meet community demands and increase utilisation of public facilities.

## What will it do?
For the general public, based on a checklist of selected facility types and the user’s desired distance, the website will display a heatmap to show recommended locations for the user to visit. To help the user to evaluate this, the website will calculate and display an “Aussie-meter” index for a particular location.

For Local Government Authorities (LGA), our concept will be able to inform facility managers of the most desired assets from the general community, based on data gathered from user queries. (e.g. which facilities are selected most frequently?). This data may also provide insight into where to place facilities to maximise their use and enjoyment by the local community. The “Aussie-meter” index can be used by local councils to compare their livability to other regions.

The website also plans to have a feedback form for users to give feedback to LGAs (e.g. I'm also interested in seeing locations of facilities like childcare centres, a new cafe has opened and isn't listed on the website, etc.).

## Why are we doing this?
We chose to build this concept so we can give the community access to community entertainment facilities to help chase the Aussie dream. The key objective is to help people measure access to community entertainment and tell people where the fun stuff is.

## What data are we using?
This project currently focuses on the use of data on public facilities within the Australian Capital Territory. So far, we are using data from the ACT Government and Victoria Government about locations of:
- Fenced Dog Parks
- Fitness Sites
- Public Furniture
- Playgrounds
- Basketball Courts
- Public BBQs
- Skate Parks

The backend of the website works by taking the user’s selection of search parameters (i.e. address/location name, types of facilities, distance) and then generating a heat-map by drawing a translucent radius around each latitude and longitude point. The “Aussie-meter” is a calculation based on number of facilities in the area and the population of the area.

## Future Project Opportunities

We have also evaluated other potential applications of our concept, as our project is scalable and can accommodate for other regions/new datasets.
The project could be applied to other indices relating to:
- Crime statistics
- Expected weather forecasts in selected locations
- Average weather conditions
- Common languages/cultures in particular areas
- Proximity to emergency services
- Accessibility of public transport, public toilets, shopping centres, libraries, drinking fountains, free Wi-Fi, boat ramps, surf lifesaving clubs, safe beaches, surfing locations

## Challenges Faced With Prototype Creation
- There was no API for public facilities so they had to be imported from CSV files manually. This presented with some issues as the CSV files were formatted differently - we had to sanitise the data to enable this import. Had a public API existed, we could have written this in a more concise and scalable manner. In the future we would provide data owners with a prescribed format or API.
- Due to time constraints we did not manage to tackle the Local Government Authorities use case, however we did manage to locate ABS data which would suit the requirements.

## Constraints 
At this stage, the website accepts data in a CSV format and contains columns with the following headers:
- LATITUDE
- LONGITUDE