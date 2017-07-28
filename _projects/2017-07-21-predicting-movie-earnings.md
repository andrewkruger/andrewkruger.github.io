---
layout: project
title: "Movies Gross Earnings Predictor"
author: andrew
tags: [projects]
img: Movies.png
description: >
---


## Predicting Opening Weekend Domestic Gross Earnings for the Movies
#### Warning: In the spirit of living in Chicago, this page is under construction.

The movie industry spends millions of dollars on cast and crew on most movies in the hopes of making many more millions in gross profit.  The earnings come from ticket sales in the U.S. (domestic) or internatational countries, video sales, merchandise, etc.  A common indicator for a movie's performance is the opening weekend gross earnings, which provides immediate feedback on how the movie is doing.  As part of a Metis Data Science Bootcamp project, I will be exploring if budget and earnings data can be used to create a predictor for the opening weekend domestic gross earnings for movies.  In short, this predictor uses the past performance of movies with the cast and crew, along with budget and number of opening theaters, to make the prediction.  Such a predictor would provide immediate feedback for how well a movie is doing, for example to give time to react and increase movie attendance while the movie is still in theaters.


<br>

## Web Scraping and Data

The financial information for many movies, including budget and gross earnings, is available on the website [http://www.the-numbers.com/](http://www.the-numbers.com/).  I web scraped the information from this site using the Python library [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/).  This library can be used to retrieve and parse the HTML file for a website.  The code I used to web scrape, parse, and organize the data is [available in a github repository](https://github.com/andrewkruger/WebscrapeBoxOfficePredictor/blob/master/WebscrapeBoxOfficePredictor.ipynb).

I first retrieved the list of movies for which [budgets are given](http://www.the-numbers.com/movie/budgets/all), and recorded the movie names, the URLs for those movies, the release date, and production budget.  

<p align="center">
    <img src="/public/img/Movie_Budget_List.png?raw=true" alt="Movie List"/>
</p>

<br>

I then used the movie URLs to get a list of cast (up to 10 actors/actresses), a list of crew (including crew credits), the URLs for cast and crew members, and the opening weekend gross domestic earnings and the number of theaters the movie was playing in.  On the webpage for each cast and crew member is a list of movies they've been in and the gross earnings for those movies.  

<br>

<p align="center">
    <img src="/public/img/John_Goodman.png?raw=true" alt="John Goodman"/>
</p>

<br>

For each of the movies in my list, I found how many movies they had been in previously, and the total gross earnings for those movies.  For the crew, I found the number of movies they had done that credit and the total gross earnings of those movies.  In this way, all data for the cast and crew is their historical data up to that movie.   Some people have had multiple roles such as both directing and producing, but I keep the historical data separate because the success of a director is not necessarily correlated with their success as a producer.

<br>

<p align="center">
    <img src="/public/img/Nolan_Movie_Table.png?raw=true" alt="Christopher Nolan Movie Table"/>
    <img src="/public/img/Nolan_Dataframe.png?raw=true" alt="Christopher Nolan Dataframe"/>
</p>

For example, refer to the partial data above for [Christopher Nolan](http://www.the-numbers.com/person/106410401-Christopher-Nolan#tab=technical). Prior to directing [*Memento*](http://www.the-numbers.com/movie/Memento#tab=summary)), he had directed one movie ([*Following*](http://www.the-numbers.com/movie/Following#tab=summary)) that had box office earnings $48,482, so that prior credit goes to *Memento*.  But *Memento* was the first movie in which he was screenwriter, so he is credited 0 movies with $0 earnings as screenwriter.  Then for [*Insomnia*](<http://www.the-numbers.com/movie/Insomnia-(2002)#tab=summary>), the gross earnings accumulate so he is credited for directing two prior movies that had a total of gross of $48,482+$25,544,867=$25,593,349.  This is repeated for all credits in the list of movies.


This process is sped up by not checking a person's financial information more than once when they are in multiple movies in multiple roles.  As I go through the actors/actresses, I check if they have had other roles for which I need information in other movies and scrape that information as well.


Number of theaters: The movie Gran Torino tarted in 6 theaters in December 2016, expanded to 84 theaters on Christmas two weeks later, then to 2,808 in the beginning of January.  The movie had a total domestic gross of $148 million, but only made $271,720 its first weekend.



## Trends in the Data

We can look at individual features to see if there are any obvious relationships with gross earnings.

### Number of Theaters

Without looking at the data, the number of theaters a movie plays in will obviously play a large role in how much the movie will earn.  [Gran Torino](http://www.the-numbers.com/movie/Gran-Torino#tab=box-office) opened in 6 theaters on the weekend of December 12, 2008 and had a total gross of $271,720.  When it opened to 2,808 theaters the following January 9, it grossed $40,524,518.  Clearly this is because having more theaters allows more tickets.  But the gross is not necessarily linear with the number of theaters.

<p align="center">
<img src="/public/img/Number_of_Theaters.png?raw=true" alt="Gross vs. Number of Theaters"/>
</p>


The non-linear upward curve is quite apparent, and it's not just a second-order relationship.  Here's the same data with the number of theaters raised to the power of six:

<p align="center">
<img src="/public/img/Number_of_Theaters_6.png?raw=true" alt="Gross vs. Number of Theaters"/>
</p>


This means we should probably fit a sixth order polynomial.

#### Accumulated Gross

There was a surprising trend when looking at the accumulated gross (sum of gross for all previous movies) as a function of number of movies an Executive Producer has done.  The 


<p align="center">
<img src="/public/img/Exec_Producers.png?raw=true" alt="Accumulated Gross vs. Number of Movies"/>
</p>





<p align="center">
<img src="/public/img/Exec_Producers_Rate.png?raw=true" alt="Accumulated Gross vs. Number of Movies"/>
</p>






