---
waltz:
  title: Educational Game Design Document Template
meta:
  version: 0.0.2
  gdd authors:
    - Ben Testani
    - Will Cantera
  template authors:
    - Austin Cory Bart <acbart@udel.edu>
    - Mark Sheriff
    - Alec Markarian
    - Benjamin Stanley
---

# Game Name
Time Commander

## Elevator Pitch
Time Commander is a strategy based tower defense game where you pool your resources to defend the crystal holding together time and space 
through active problem solving involving clocks of various formats, timezones, and waves of unique enemies.

## Influences (Brief)

- Bloons Tower Defense Series
  - Medium: Game, originally browser based, now on mobile and many other platforms
  - Explanation: The main reason this is an influence is because it is a tower defense game, 
                 Time Commander is a tower defense game of a similar style and owes some 
                 inspiration to arguably one of the most successful tower defense games of our time.

- Dungeon Defenders:
  - Medium: Game, available on a variety of consoles
  - Explanation: Dungeon Defenders is another tower defense game but one in which the player is
                 much more involved in the experience. This is an influence because Time Commander 
                 will be more than setting up a defense and idling, the player is engaged at all times.
                 
- The Lady of the Lake:
  - Medium: Book
  - Explanation: This is the last book in the Witcher series by: Andrzej Sapkowski. The main character
                 Cirilla, and her ability to jump to different timelines is intriguing, and Time Commander
                 will have the player traveling between past, present, and future.

## Core Gameplay Mechanics (Brief)

- Point and click onscreen to construct defenses in the direction hinted at by the announcer
- Use the mouse to set the clocks involved with chest opening to the correct time to open the chest.
- After surviving a number of waves, a new level is displayed, up to three levels
- Use powerups earned from opening chests to buy defend the crystal
- Select disposable items gathered in the game and use then on waves of enemies
- If enemies make it to the time crystal, the crystals health is drained, the game is over when it reaches zero
- Hold the spacebar for a popup wheel of powerups the player can drag and drop into the scene.


# Learning Aspects

## Learning Domains

Telling time
- Reading analog clocks, including those without numbers
- Reading military time
- Basic arithmetic 
- Strategy based decision making

## Target Audiences

Young people who struggle to tell time without a digital clock to look at.
The target age range for players is 8-12


## Target Contexts

Ideally this game would be played outside of class to better prepare students for formally learning about telling time.
Certainly, this game would be great to play during free time given to students in a computer lab. 


## Learning Objectives

- After playing this game, players will be able to properly interpret the time on an analog clock with numbers included on the clock.
- After playing this game, players will be able to properly interpret the time on an analog clock without numbers included on the clock.
- After playing this game, players will be able to tell the time on a digital clock given that it uses military time.


## Prerequisite Knowledge

- Before playing the game, players should be able to do basic arithmetic, ie. adding and subtracting numbers.
- Before playing the game, players should be able to explain what a tower defense scenario entails.
- Before playing the game, players should be able to identify different types of clocks, mainly: analog, digital


## Assessment Measures

A pre-test and similar post-test should be designed to assess what progress was made as a result of playing the game:
  - Blank analog clocks without numbers with a given time with which to draw on the clock.
  - Basic arithmetic involved questions about how much time is between two or more given times.


# What sets this project apart?

- Most tower defense games involve mindlessly watching the players defenses do all the work, in Time Commander, the player has an opportunity to learn
  about telling time in their decision makeing and will have a more active role in terms of using consumable items during enemy onslaughts.
- Players will have a different experience each time they play, so there are more opportunities to learn material they may have missed the first time.
- This isn't a typical tower defense game. Enemies do not predictably come down the same lane each level. In Time Commander, enemies approach the players
  base randomly from three-hundred and sixty degrees based on hours on an analog clock.


# Player Interaction Patterns and Modes

## Player Interaction Pattern

The game is meant for one player, the player uses the cursor and some buttons on the keyboard to interact with the system to do actions such as building/maintaining defenses, and ceasing hordes of enemies.


## Player Modes

Single Player Mode: The player makes their way through three levels by solving time based problems and maintaining their defenses and inventory.


# Gameplay Objectives

- Survive waves of enemies:
    - Description: There are three levels the player must get through, each containing three waves of enemies to get past.
    - Alignment: This aligns with the learning objectives of reading time from analog and digital clocks in standard and military time because 
    the player must make their decisions with time and the clock in the game background in mind by using the hints to correctly place defenses.


# Procedures/Actions

The player can build structures by selecting and dragging them to the desired location. The player can earn powerups by opening
chests obtained from vanquished enemies. The powerups can be used during enemy attacks to
help the defense clear out enemies or bail the player out if they did not correctly place a defense in an area being attacked. Chests can be opened up after 
waves by interacting with the clock lock visual on the chest. If the player manages to set the clock to the correct time given on a digital clock, the
chest opens.  The Player can also drag and drop powerups gained from the chests to the game to help defend the time crystal.


# Rules

The main resource available to the player are the enemies they fend off. Successfully clearing these enemies off the screen with defensive structures
give the enemies a chance to drop a chest the player can open to get powerful powerups. After fending off three waves of enemies, the player will have beaten the current level, and will have to go through two more levels, so three levels in total, each containing three waves. 


# Objects/Entities

- A brief "tutorial" at the start of the game, how to place a structure/open a chest
- The players various types of available defenses 
- different enemy types
- disposable items to buy
- A player inventory to hold the disposable items


## Core Gameplay Mechanics (Detailed)

- There will be three main levels in the game. In each level, the player must survive three waves of enemies which will get increasingly numerous and difficult
 to deal with. Once the third level is complete, the game is over and the player has won. A final screen will appear telling the user the won.
- Text will come onto the players screen throughout the game indicating where the next set if enemies will come from. This is the direction that the player should build his defenses towards during the builing time. For example, if they player is warned enemies are approaching from 3:00, they should build a defense
in that direction
- While enemies are attacking, the player cannot build any additional structures. The idea is, they should have prepared correctly based on the hints given
 before the attack.
- If the player failed to position the defensive structures correctly in the build time, they have the opportunity to use consumable items to hold off waves of
 enemies if they have any.
- Getting through each level: In order for the player to fend off the waves of enemies aproaching their time crystal, they must buy defensive structures
 either given to them after each round or earned from opening chests.
- Enemy Movement: Enemies come in waves towards the players time crystal and if they reach it, the crystal is attacked until the player themselves interfere
 and stop them. Players defenses will be able to attack targets that have moved behind them to the crystal.
- Layout of the map: The players base is in the middle of the screen where the time crystal is and will have space around it to build defenses against incoming enemies. Enemies walk onto the screen based on a random time and approach the time crystal. The time crystal is behind the players defensive line and this is the final location the enemies try to reach.
- Player can drag and drop powerups gained from successfully opening chests to use to their advantage in defending the time crystal.


    
## Feedback

- Correctly positioning the clock when opening a chest will reward the player with an upgrade, a noise queue will play to let them   
  know they are correct
- Incorrect attempts at opening chests will play a bad sound, it will be clear the answer was wrong.
- When completing each of the three levels, the player will observe the background and scenery change along with a change in the ambient music to fit a unique
  theme for the given level.

# Story and Gameplay

## Presentation of Rules

- To avoid walls of text that nobody wants to read, the player will go through a tutorial which will be brief as to not lose their attention before the game
  even starts.
- Mechanically speaking, the tutorial described above will show the player how to place defensive structures and buy items with the gold earned from destroying
  enemies. 

## Presentation of Content

- To teach the core material without a wall of text, the player will go through the tutorial introduced above. The mechanics this tutorial will go over are 
  closely related to the task of interpreting times from a clock. In essence, the player can learn about the core mechanics of Time Commanders while also 
  getting an introduction to how telling time in standard/military on clocks of various kinds works.

## Story (Brief)

The time crystal holding time and space together is under attack by those who seek the end of the universe! The Time Commander must step up to defend life
as we know it by building a defense with magical powers controlled by time against the relentless waves of enemies quickly approaching.

## Storyboarding

- The typical playthrough of the game will go as follows:
  - The player must defend the time crystal located in the center of the screen which sits ontop of a very large analog clock without numbers.
  - The player will start out with one basic defensive structure and a warning that an enemy is coming from a certain time, say 5:00
    - The player will have to choose a position to place the structure, hopefully at 5:00 and and enemy will come to that position to attack.
      - If the player messed this up, that's fine, it is just one enemy and is meant to be a small tutorial of sorts. 
      - The enemy always drops a chest and the player will have the opportunity to open it by setting the clock to the correct time given in 12 hour time.
      - This wraps up the tutorial portion
    - Now the first real wave comes, the player is given two additional defensive structures to place along with a warning of where the enemies are coming from
      - The player should survive the onslaught and collect more chest drops for more powerups to help with later waves.
      - After each wave the player has some time to set up more defenses based on given information about which direction enemies come from 
    - This pattern continues for three waves per level. There are three levels in total, so nine waves overall.
    - Times at which the enemies appraoch the players base are random, enemy types are random, so the game has great replayability.
    - By the end of the third level, the player wins and is presented an overall summary of how they did.
      - This is based on hits the crystal took, successfull attempts of opening chests, and total number of enemies vanquished.
    


![board1](https://user-images.githubusercontent.com/47586729/78372356-2cc76d00-7597-11ea-8204-2d20cb97520a.jpg)
This screen would show an example of a clock and a question asking what time it is, if the player gets it right they get a timebomb to destroy enemies, or else they lose the gold it costs for the question.

![board3](https://user-images.githubusercontent.com/47586729/78372587-7617bc80-7597-11ea-86b1-744603804dfc.jpg)
This is the main screen where the enemies will try to get past the players defenses to get to the gem and destroy it

![forge](https://user-images.githubusercontent.com/47586729/78379745-d7905900-75a0-11ea-8870-8e8a9b89a1aa.jpg)This is the screen where the player is adding more defensive structures to help fend off the enemies

![board4](https://user-images.githubusercontent.com/47586729/78372623-7f088e00-7597-11ea-8705-3267e729b27b.jpg)
This is the image where the player is about to lose the game because all of the enemies have made it past the defenses and are destroying the gem


# Assets Needed

## Aethestics

The games aesthetics should give a magical feeling as if the player is a wizard or witch in their tower using arcane knowledge to fend off foes.
There should be vibrant, light colors in the background and the structures built by the player should follow suit in looking whimsical/magical.

## Graphical

- Characters List
  - Time Goblin: Most basic type of enemy, average movement speed, come in large numbers, no special attacks or attributes.
  - Armored Goblin: More advanced enemy, slow movement speeed, come alone or in small groups, heavy armor and weapons.
  - Speed Goblin: Slightly advanced enemy, fast movement speed, come in large numbers or waves, light armor and weapons.
  - The Punisher: May appear once per game, throws itself into players defenses, destroying one of them and decimating, (taking 10% of) the players gold.
- Textures:
  - To Be Added As Needed
- Environment Art/Textures:
  - Arcadey background image/texture
  - More To Be Added As Needed


## Audio

- Music List (Ambient sound)
  - A Magic Cave: https://www.youtube.com/watch?v=n9bFQrH3RRg 
  - Victory Fanfare: https://www.youtube.com/watch?v=3suGfhnT2Sg&t=11s  
  - More To Be Added As Needed

- Sound List (SFX)
  - Building a defense: https://www.youtube.com/watch?v=Wc1Ae0kWdQ0
  - Killing an enemy: https://www.youtube.com/watch?v=3w-2gUSus34
  - Answering a question correctly: https://www.youtube.com/watch?v=KYQP4JJr-kI
  - Answering a question incorrectly: https://www.youtube.com/watch?v=dNX-FeeOpwQ
  - More To Be Added As Needed


# Metadata

* Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
* Version 0.0.3
