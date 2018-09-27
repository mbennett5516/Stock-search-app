# Stock Search Application Homework

## Overview

You're being tasked with creating a fully fleshed out, crypto currency web application for your client. This application will use the [iexTrading API](https://min-api.cryptocompare.com/) to make a dynamic web page that populates with crypto currency information of the user's choice. To finish this task, you must call the cryptoCurrency API and use JavaScript and jQuery to change the HTML of your site.

## Before You Begin

**Hit the iexTrading API**.

Fool around with the iexTrading API. [iexTrading API](https://www.cryptocompare.com/api#introduction).

Be sure to read about `Batch` and `Reference Data` (for validation)
   
Make sure you switch the protocol in the query URL from **`http to https`**, or the app may not work properly when deployed to Github Pages.

You should have a high-level understanding of how this assignment works before attempting to code it.

## Submission on BCS

* Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

## Instructions

1. Before you can make any part of our site work, you need to create an array of strings, each one related to a stock symbol that interests you. Save it to a variable called `stocksList`.

2. Your app should take the stocks in this array and create buttons in your HTML.

   * Try using a loop that appends a button for each string in the array.

3. When the user clicks on a button, the page should grab the company name, logo, price, and up to 10 news articles related to the stock from the iexTrading API and place them on the page.

4. Make a seperate iexTrading API call that will retrieve all stock symbols available in iexTrading and store it into an array called `validationList`. 

4. Add a form to your page that takes the value from a user input box and adds it into your `stocksList` array only if the input exists in our `validationList`. Hint: You'll want to make sure the user input is always capitalized. Then make a function call that takes each topic in the array remakes the buttons on the page.

5. Deploy your assignment to Github Pages.

6. **Rejoice**! You just made something really cool.

- - -

## Minimum Requirements

Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed. Adding a README.md as well as adding this homework to your portfolio are required as well and more information can be found below.

- - -

## Bonus Goals

1. Ensure your app is fully mobile responsive.

2. Allow users to request additional stock information to be added to the page.
   * Each request should ADD stock information and related news articles to the page, NOT overwrite the existing stock information and related news articles.

3. List additional metadata (CEO, tags, etc) for each company in a clean and readable format.

4. Integrate this search with additional APIs such as New York Times API. Be creative and build something you are proud to showcase in your portfolio

5. Allow users to add their favorite stocks to a `favorites` section.
   * This should persist even when they select or add a new topic.
   * If you are looking for a major challenge, look into making this section persist even when the page is reloaded (via localStorage or cookies).

## Reminder: Submission on BCS

Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

- - -

## Create a README.md

Add a `README.md` to your repository describing the project. Here are some resources for creating your `README.md`. Here are some resources to help you along the way:

* [About READMEs](https://help.github.com/articles/about-readmes/)

* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)

- - -

## Add To Your Portfolio

After completing the homework please add the piece to your portfolio. Make sure to add a link to your updated portfolio in the comments section of your homework so the TAs can easily ensure you completed this step when they are grading the assignment. To receive an 'A' on any assignment, you must link to it from your portfolio.

- - -

## One More Thing

If you have any questions about this project or the material we have covered, please post them in the community channels in slack so that your fellow developers can help you! If you're still having trouble, you can come to office hours for assistance from your instructor and TAs.

**Good Luck!**
