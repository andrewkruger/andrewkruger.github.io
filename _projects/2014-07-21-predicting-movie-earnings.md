---
layout: project
title: "Prioritizing MTA Stations by Targeted Commuters"
author: andrew
tags: [projects]
img: titlesmap.png
description: >
---


tractenberg method

## MTA Subway Commuter Analysis

We were given the project of working with a mock non-profit called WomenTechWomenYes (WTWY) who is planning on going to New York MTA subway stations to pass out pamphlets advertising their Women in Technology gala.  The gala was planned for the end of May, so they would be canvassing in April and May.  Their goal was to increase participation in the gala and to spread awareness of WTWY.  Our plan was to optimize the time of the street times passing out pamphlets by showing them the best times and stations to go to.  


## Data Resources

In order to acheive this, we wanted to maximize not just the number of commuters the street teams would see, but the number of people who would most likely be interested in their program and gala.  This means we needed data on subway traffic and demographic information about who would be likely be using the subway stations, including sex, education, and profession.

We gathered numeric information from multiple sources, including:

1. Subway station commuter entrance and exit counts for turnstiles and GPS coordinates of subway stations from the website http://web.mta.info/.  
1. Demographics of the surrounding neighborhood in which the subway station is located from https://opendata.cityofnewyork.us/.
1. Locations of technology startups from http://www.digital.nyc/.

The demographic information included sex, highest degree attained, and area of profession.  The technology startups could be used as a tracer for tech hubs, and then the GPS coordinates of the stations could be used to isolate stations near those hubs.  By combining this information, we sought to increase the likelihood of canvassing female employees of technology companies.


## Data Processing

#### Turnstile and Station Identifiers


![MTA dataframe](/public/img/MTA_df.png)


The turnstile data was created by audits of the turnstiles every 4 hours.  The turnstile data includes

- Control Area (C/A), 
- Unit, a unique identifier for each station
- Subunit Control Positions (SCP)
- Station, the name of the stop
- Linenames of subway lines served by the station
- Date of audit
- Time of audit
- DESC
- Entries
- Exits

Below is a sample of the data for stations with the name 135th St (135 ST).


![Station and Turnstile identifiers](/public/img/Station_Info.png)


Because stations are identified by the stop, there were multiple stations with the same name (there is a 135th St. stop for lines 2/3, and lines B/C).  Thus, we needed to identify stations by both the "Station" value and the "Linename":

~~~py
    df_day['STATION-LINE'] = df_day['STATION'] + ' ' + df_day['LINENAME']
~~~


(A station could also be identified by its Unit number, although we found that it was not descriptive enough for our needs below.)  

Within each station, there can be multiple C/A's, all of which have a unique identifier (Line 2/3, 135th St. station has C/A's R306 and R307).  Each C/A has multiple turnstiles identified by it's SCP, but the SCP number is not necessarily unique across different C/A's (N024 and R306 both have a turnstile with SCP number 00-00-00).  Thus, a unique turnstile needed to be identified by both the C/A and SCP (or C/A and Unit).

~~~py
    df['Turnstile'] = df['C/A']+' '+df['SCP']
~~~


#### Turnstile Data

The entry and exit counts for each turnstile are cumulative total counts every 4 hours.  In processing this information, we identified that some turnstile cumulative totals decreased.  Some of these decreases were due to the counts being reset.  A few turnstiles would continually decrease over some periods of time for unknown reasons.  Any negative counts were removed from the data.

Not all 4 hour increments for the audits were synchronized.  Most turnstiles gave counts at midnight and every 4 until the next midnight. The second most common series started at 1:00am.  Most of the remainder had start times that were completely random.  To fix this, and to synchronize the data, we considered anything between 10:00pm and 2:00am as being midnight.  This shifted some of the data by at most 2 hours, but it allowed us to more directly compare the turnstile counts based on morning, midday, and afternoon intervals.  Further, by not limiting the turnstiles to only those being audited at specific hours, we nearly doubled the 

Some counts were unrealistically high.  To fix this, we made an upper limit of counts we would accept.  To decide what this limit should be, we created a histrogram that binned the counts for all turnstiles (shown below).  Most counts are zero (from when stations are closed) then the number of times higher counts decreases until at about 9,000 the frequency of counts becomes sparse.  Some of these higher counts could be due to events, but we did see that for a few stations, they did get up to 10,000 on a more frequenty basis so those are not likely outliers that should be removed.  We thus used 10,000 as an upper limit, leaving commuter counts that are likely real and typical for each turnstile.

![Histogram of all turnstile counts](/public/img/Turnstile_Hist_1.png)

![Histogram of higher turnstile counts](/public/img/Turnstile_Hist_2.png)



## Station traffic

After the data was cleaned, we calculated the counts for each 4 hour interval by finding the difference in counts between audits.

~~~py
    df_4hour = df.copy()

    #Create columns for total counts by each 4 hours
    df_4hour['New_Entries_Hour'] = df_4hour.groupby(['Turnstile'])['ENTRIES'].diff().shift(-1)
    df_4hour['New_Exits_Hour'] = df_4hour.groupby(['Turnstile'])['EXITS'].diff().shift(-1)
    df_4hour['Counts_Hour'] = df_4hour['New_Entries_Hour'] + df_4hour['New_Exits_Hour']
~~~

We totaled up these counts to find the traffic by day.

~~~py
    df_turnstile_day = df_4hour.groupby(['STATION-LINE','Turnstile','Day_of_Week'])['Counts_Hour']
    df_turnstile_day = df_turnstile_day.sum().to_frame().reset_index()
    df_turnstile_day = df_turnstile_day.rename(columns={'Counts_Hour':'Counts_Day'})
~~~



![Top 10 Stations](/public/img/Station_Rank.png)






## Station Locations

The table of coordinates for stations provided by web.mta.info has Station ID numbers for each station, which are not included in the turnstile data.  Further, they did not provide a way to connect Station ID to any of the station identifiers in the turnstile data.  To connect these two sets, we needed an intermediate set of information.  Fortunately, we found this in a table provided by someone online who created a list of MTA station that contained both Station ID and Unit numbers.

~~~py
    # Intermediate data connecting Station ID and Unit values
    rbs = pd.read_csv('../challenges_data/Remote-Booth-Station2013.csv')
    df_coords = pd.merge(df,rbs[['C/A','STOPID']],on='C/A')

    # Read in coordinates from web.mta.info and merge
    coord = pd.read_csv('http://web.mta.info/developers/data/nyct/subway/Stations.csv')
    coord = coord.rename(columns={'GTFS Stop ID': 'STOPID'})
    df_coords = pd.merge(df_coords,coord[['STOPID','GTFS Latitude','GTFS Longitude']],on='STOPID')

    # Check that all stations have coordinates (should be False)
    df_coords[['GTFS Latitude','GTFS Longitude']].isnull().values.any()
~~~


Now that we had the coordinates of each station, we could find the stations within a targeted region.  We found that the tech startups on digital.nyc did trace out the tech hubs in Silicon Alley and Lower Manhattan.  


![Startups used to trace tech hubs](/public/img/New_York.png)


![Silicon Alley and Lower Manhattan](/public/img/New_York_2.png)


To get stations near tech hubs, we used coordinate boxes that encompassed those areas, and did a search of stations within that area.  For example, to search the area of dense tech companies just south of Central Park, we limited the search to staitons with longitudes between -73.994992 and -73.975443, and latitudes between 40.735691 and 40.759721.

~~~py
    latitude = [40.735691, 40.759721]
    longitude = [-73.994992, -73.975443]
    target_area = df_coords.copy()
    target_area = target_area[target_area['GTFS Latitude']>latitude[0]]
    target_area = target_area[target_area['GTFS Latitude']<latitude[1]]
    target_area = target_area[target_area['GTFS Longitude']>longitude[0]]
    target_area = target_area[target_area['GTFS Longitude']<longitude[1]]
    
    # Get the ranking of the stations in the target area.  
    target_area_ranks = ranked[ranked['STATION-LINE'].isin(target_area['STATION-LINE'])]
~~~

The following is the dataframe created showing the top stations in the target area, showing their positions for all of New York City, and the total counts for April/May 2016.


![Dataframe of top silicon alley stations](/public/img/Silicon_Alley_df.png)



## Targeting Demographics

While canvassing at the busiest stations will result in the street teams being able to canvass to the most people, they may not necessarily encounter the most people who would be interested in the WTWY gala.  To target the demographics, we weighted the commuters by the demographics of the surrounding community.  We multiplied the total number of people by the percent who are female, who have a Bachelors degree or higher, who is in the science and technology profession.

Many of the top stations stayed the same after weighting by demographics, but some showed a large change due to a smaller number of target commuters.  Typically the percentage of residents around the stations with Bachelors was in 30-40's range, graduate degree percentages were also in the 30-40's, and percentage of careers in professional and scientific industries in the 10-20's.  But, as an example, Flushing-Main St. (Line 7) is in a neighborhood with residents having significantly fewer Bachelor degrees (17%), graduate degrees (8.1%), and careers in professional and scientific industries (9.1%).  While Flushing-Main St. was the fourth busiest station, it dropped to the 22nd top station of targeted commuters.

We compared the top 10 busiest stations with the top 10 suggested stations based on demographics, and found that because there were simply 5% fewer total commuters in our suggested stations, there would be a 4% drop in total females the WTWY canvassers would encounter.  However, the commuters would be targeted, so there would actually be an increase of 1-2% more females in technical professions (6% more people in technical professions when including males) and 5% more females with graduate degrees (10% more people when including males).

These demographics are for the residents, and doesn't include the commuters from other communities who would be coming to those stations for their jobs.  Since we have also targeted stations near tech hubs, this would further increase the percentage of people who would likely be interested in the WTWY gala.




## Overview

By using commuter rates, demographic information, and location data for MTA subway stations, we were able to create a priority list of stations that would most likely have commuters who are famales with higher education degrees and careers in tech industries.  We were also able to identify optimal times for WTWY to be convassing for their gala, and showed that priorities would change between morning and afternoon rush hours as some stations would have higher traffic in the afternoon while others showed little difference.

With this information, we would be able to create a canvassing schedule based on the availability of street teams and the number of days they are able to work.  Using the methods shown above, if the workers were available on more days, we could expand their work to new priority stations in parts of tech hubs not yet covered.












The movie industry spends millions of dollars on cast and crew on most movies in the hopes of making many more millions in gross profit.  The profit comes from ticket sales in the U.S. (domestic) or internatational countries.  The financial information for movies, including budget and gross earnings, is available on the website http://www.the-numbers.com/.  This site also includes the information about cast and crew, showing which movies they acted or worked in and the gross earnings of those movies.  

This project has the aim of creating a predictor for the success (gross earnings) of a movie based on who is in the cast and crew.


I go to the webpage for the movie and get all the budget and gross earnings.  I also find the who was in the cast and crew, and I put all the names and URLs for the cast and crew into a separate pandas dataframe based on what they did in that movie (act, direct, screenwrite, etc.).

Next, I start finding information on the people.  For each actor/actress, I find the number of movies they acted in and the total gross earnings for those movies (both provided on their webpage).  I also do this for the directors for the movies they directed, etc.  Some people have had multiple roles such as both directing and acting, but I keep those finances separate because the success of an actor/actress is not necessarily correlated with their success as a director.

This process is sped up by not checking a person's financial information more than once when they are in multiple movies in multiple roles.  As I go through the actors/actresses, I check if they have had other roles for which I need information in other movies and scrape that information as well.'

After I have scraped the information about the movies, I start going through the list of cast and find the acting credits for each.  I see how many movies they've been a part of, and the total gross for those movies (both are provided on the page).'