--- 
Main
---

Card actions:
Skip - X - Long press ??
Like - Swipe to the right
Dislike - Swipe to the left
Like & comment - Swipe to the top
Dislike & comment - Swipe to the bottom

Implement:
Add 'subscribe to @<username>' (not just text placeholder) functionality for users opinions/reactions/favorites if view
is restricted to followers only'
TOPinions (recent opinions with most attention)
Trends (shows agreed/disagreed statistic for the specific opinion tag)
Fellow thinkers (show people with similar reactions to some opinions)
??? Possibility to leave Audio or Video reactions ???

---
Indications
---
User opinions:
Owner:
(1) For the owner nothing should be highlighted as you can't react to own opinions
Visitor:
(2) If viewer has reacted to any of opinions, corresponding reaction should be highlighted

User reactions:
Owner:
(3) For the owner there will be indication of reaction similar to (2)
Visitor:
(4) If owner's has reaction, it will appear at the top/bottom of opinions with text like '@<username> agreed with' with
some visual indication as well
(5) If viewer has reacted to any of opinions, corresponding reaction should be highlighted (similar to (2))

User favorites:
Owner:
(6) For the owner there will be indication of reaction similar to (2)
Visitor:
(6) For the visitor there will be indication of reaction similar to (2)

---
Privacy
---
User opinions:
Owner:
Has no restriction
Visitor:
Should take into account owner's view_opinions privacy setting.
Visitor should see corresponding banner which provokes action. E.g. if owner
restricted view_opinions to followers, banner should show corresponding text
and subscribe button (behavior can be different for when owner has to accept follow request first)

User reactions:
Owner:
-Should take into account opinion's owner view_opinions privacy setting
Visitor:
-Should take into account owner's view_reactions privacy setting first
-Should take into account opinion's owner view_opinions privacy setting

User favorites:
Owner:
-Should take into account opinion's owner view_opinions privacy setting (ignore if opinion belongs to owner)
Visitor:
-Should take into account owner's view_favorites privacy setting first
-Should take into account opinion's owner view_opinions privacy setting

---
Navigating to Opinion Page in different scenarios
---
Clicking open/copying opinion link from User Opinions tab should:
Open opinion page that acts as general opinions page (/) but will load new cards from user opinions pool
Link will be different too. Possible link formats (they should be consistent):
/opinion/:opinionId/:scope where scope in this case may be equal to 'user'
OR
/opinion/:opinionId?scope=user

Clicking open/copying opinion link from User Reactions tab should:
Open opinion page that acts as general opinions page (/) but will load new cards from user reactions pool
Link will be different too. Possible link formats (they should be consistent):
/opinion/:opinionId/:scope where scope in this case may be equal to 'reactions'
OR
/opinion/:opinionId?scope=reactions

Clicking open/copying opinion link from User Favorites tab should:
Open opinion page that acts as general opinions page (/) but will load new cards from user favorites pool
Link will be different too. Possible link formats (they should be consistent):
/opinion/:opinionId/:scope where scope in this case may be equal to 'favorites'
OR
/opinion/:opinionId?scope=favorites

Copying opinion link from general opinions page should:
Open opinion page that acts as general opinions page (/) but will load new cards from all opinions pool
Possible link formats (they should be consistent):
/opinion/:opinionId




