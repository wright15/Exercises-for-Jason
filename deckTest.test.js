const { test } = require('@playwright/test');
const { chromium } = require('playwright');
const assert = require('assert');
const axios = require('axios');

test('deckTest', async ({ page }) => {
    const browser = await chromium.launch({
        headless: false
    });
    const context = await browser.newContext();

    const response = await page.goto('https://deckofcardsapi.com/');
    const statusCode = response.status();
    console.log(`Status code: ${statusCode}`);
    assert.strictEqual(statusCode, 200, `Expected status code 200, but got ${statusCode}`);

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://deckofcardsapi.com/api/deck/new/',
        headers: {}
    };

    let deckId = "";
    await axios.request(config)
        .then((response) => {
            deckId = response.data.deck_id; // Access deck_id directly
            console.log(response.data); // Log the entire object
            console.log(deckId); // Log the deck_id
        })
        .catch((error) => {
            console.log(error);
        });

    let shuffle = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`,
        headers: {}
    };

    await axios.request(shuffle)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    let cards = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`,
        headers: {}
    };

    let firstThreeCardCodes = [];
    let lastThreeCardCodes = [];
    await axios.request(cards)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            firstThreeCardCodes = response.data.cards.slice(0, 3).map(card => card.code);
            lastThreeCardCodes = response.data.cards.slice(-3).map(card => card.code);
            console.log(firstThreeCardCodes);
            console.log(lastThreeCardCodes);
        })
        .catch((error) => {
            console.log(error);
        });

    const formattedfirstThreeCardCodes = firstThreeCardCodes.join(',');
    const formattedlastThreeCardCodes = lastThreeCardCodes.join(',');

    let dealP1 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/one/add/?cards=${formattedfirstThreeCardCodes}`,
        headers: {}
    };

    await axios.request(dealP1)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    let dealP2 = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/two/add/?cards=${formattedlastThreeCardCodes}`,
        headers: {}
    };

    await axios.request(dealP2)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    let listDeckOne = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/one/list/`,
        headers: {}
    };

    await axios.request(listDeckOne)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    let listDeckTwo = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://deckofcardsapi.com/api/deck/${deckId}/pile/two/list/`,
        headers: {}
    };

    await axios.request(listDeckTwo)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

    // Function to check if a card is a 10-point card (10, Jack, Queen, King)
    function isTenPointCard(cardValue) {
        return ["10", "J", "Q", "K"].includes(cardValue);
    }

    // Function to check if a card is an Ace
    function isAce(cardValue) {
        return cardValue === "A";
    }

    // Function to check if a hand has a winning blackjack combination
    function hasWinningBlackjackCombination(hand) {
        const hasAce = hand.some(card => isAce(card.slice(0, -1)));
        const hasTenPointCard = hand.some(card => isTenPointCard(card.slice(0, -1)));

        return (hasAce && hasTenPointCard) || (hasAce && hand.some(card => ["J", "Q", "K", "10"].includes(card.slice(0, -1))));
    }

    // Check if either list has a winning blackjack combination
    if (hasWinningBlackjackCombination(firstThreeCardCodes) && hasWinningBlackjackCombination(lastThreeCardCodes)) {
        console.log("Both players have a winning blackjack hand!");
    }
    else if (hasWinningBlackjackCombination(firstThreeCardCodes)) {
        console.log("Congratulations player 1! You have a winning blackjack hand!");
    } else if (hasWinningBlackjackCombination(lastThreeCardCodes)) {
        console.log("Congratulations player 2! You have a winning blackjack hand!");
    } else {
        console.log("Sorry, no one won blackjack.");
    }

    // ---------------------
    await context.close();
    await browser.close();
});