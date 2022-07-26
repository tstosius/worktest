/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');


// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.onEnterLayer('votePos').subscribe(() => {
		(WA.state.votePos as number) ++;
	})
	WA.room.onLeaveLayer('votePos').subscribe(()  => {
		(WA.state.votePos as number) --;
	})
	WA.room.onEnterLayer('voteNeg').subscribe(()  => {
		(WA.state.voteNeg as number) ++;
	})
	WA.room.onLeaveLayer('voteNeg').subscribe(() => {
		(WA.state.voteNeg as number) --;
	})
	WA.room.onEnterLayer('voteNeut').subscribe(() => {
		(WA.state.voteNeut as number) ++;
	})
	WA.room.onLeaveLayer('voteNeut').subscribe(() => {
		(WA.state.voteNeut as number) --;
	})

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));


export {};
