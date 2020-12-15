# musicplayer-react-native

A Media player developped in React Native.

I started this project to learn React Native, but gave up midway because of React Native poor management of Lists. The UI is still somewhat 
functional (but not polished and a bit ugly), but there is no link with the backend Android code that manage the actual MediaPlayer.


<img src="https://github.com/hokolomopo/musicplayer-react/blob/main/screenshots/screen1.jpg" width="300" >                     
<img src="https://github.com/hokolomopo/musicplayer-react/blob/main/screenshots/screen2.jpg" width="300" >


## The problem of React Native

Tl;Dr : React Native is bad with long lists that the user want to scroll fast (like a list of songs), I'm going back to Android developpement.


My main problem, and why I gave up on this project was the management of lists in React Native. The only component that manage lists in React Native is FlatList
(ListView being deprecated). But Flatlist is good and optimized for ONE THING ONLY, that is for infinite lists that load as you go down, like Facebook wall for example (React Native was developped by Fecebook).
But for my purposes I needed a list that displays all the songs on the device (3000+), that allows for the user to scrool through it quite fast. And even with a lot of tuning,
FlatLists are almost comically bad at this, displaying huge blank spaces for several seconds when scrolling down too fast. 

I found a library that impelmented the equivalent of RecyclerView of android (a bit less performant but way better than FlatLists), but I also wanted a list with a drag & drop funcionality
(to modify the order of the songs that are waiting to be played). And those functionalities were developped (by third parties, not the React Native devs) for FlatLists, not the RecycclerView I found. 
I didn't want to spend a week developping the drag & drop function on the RecyclerView, so I kinda gave up on the project.

Before giving up, I tried to wrap Android code in React Native components to have a RecyclerView with drag & drop, but it didn't work because some types events seems to be
intercepted by React (or react was messing up witht he state of the Views) and the drag and drop wasn't working.

So yeah, React is nice for some things, but really lacking in some aspects. I'm going back to develop this app in Android, the code is a bit longer to write but all the functionalities are there. 
(Did you know that React Native doesn't even implements CheckBoxes? You have to use third-party libraries for that. Crazy).
