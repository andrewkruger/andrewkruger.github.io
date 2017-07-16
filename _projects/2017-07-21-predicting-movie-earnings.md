---
layout: project
title: "Movies"
author: andrew
tags: [projects]
img: titlesmap.png
description: >
---


The movie industry spends millions of dollars on cast and crew on most movies in the hopes of making many more millions in gross profit.  The profit comes from ticket sales in the U.S. (domestic) or internatational countries.  The financial information for movies, including budget and gross earnings, is available on the website http://www.the-numbers.com/.  This site also includes the information about cast and crew, showing which movies they acted or worked in and the gross earnings of those movies.  

This project has the aim of creating a predictor for the success (gross earnings) of a movie based on who is in the cast and crew.


I go to the webpage for the movie and get all the budget and gross earnings.  I also find the who was in the cast and crew, and I put all the names and URLs for the cast and crew into a separate pandas dataframe based on what they did in that movie (act, direct, screenwrite, etc.).

Next, I start finding information on the people.  For each actor/actress, I find the number of movies they acted in and the total gross earnings for those movies (both provided on their webpage).  I also do this for the directors for the movies they directed, etc.  Some people have had multiple roles such as both directing and acting, but I keep those finances separate because the success of an actor/actress is not necessarily correlated with their success as a director.

This process is sped up by not checking a person's financial information more than once when they are in multiple movies in multiple roles.  As I go through the actors/actresses, I check if they have had other roles for which I need information in other movies and scrape that information as well.'

After I have scraped the information about the movies, I start going through the list of cast and find the acting credits for each.  I see how many movies they've been a part of, and the total gross for those movies (both are provided on the page).'
