---
layout: post
title: "Linking to a Page Section in Github Pages"
author: andrew
tags: [blog]
description: >
---


## Heading Anchors

If you want to link to a specific section of a blog or project, you can use an anchor link.  This way you can send readers directly to a section you're referring to, or create a table of contents at the beginning.  To create an anchor to a section on the same page, use a `#` then the section name in lower case with a `-` instead of spaces.  For example, to link to [the next section of this post](#other-pages), you would use `[some words](#other-pages)`.



## Other Pages

If you click on the link above, you can see that the html for the page now has `#other-pages` at the end.  This shows that if you want to link to a section of another page, you can just put the anchor link at the end of the html for the page.


## Table of contents

You can create a table of contents for your projects if you make a list of sections with anchor links.  For example, the table of contents for my [MTA Project](https://andrewkruger.github.io/projects/2017-07-11-prioritizing-mta-stations-by-targeted-commuters#data-resources) would made by:

```
    1. [MTA Subway Commuter Analysis](#mta-subway-commuter-analysis)
    1. [Data Resources](#data-resources)
    1. [Data Processing](#data-processing)
        - [Turnstile and Station Identifiers](#turnstile-and-station-identifiers)
        - [Turnstile Data](#turnstile-data)
    1. [Commuter Counts](#commuter-counts)
    1. [Station Locations](#station-locations)
    1. [Targeting Demographics](#targeting-demographics)
    1. [Day and Time](#day-and-time)
    1. [Overview](#overview)
```
