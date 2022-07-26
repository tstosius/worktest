/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { ButtonDescriptor } from "@workadventure/iframe-api-typings/Api/iframe/Ui/ButtonDescriptor";

console.log('Script started successfully');

// let currentPopup: any = undefined;
const  buttons: ButtonDescriptor[] = [
    {
        label: 'Reset',
        className: 'error',
        callback: () => WA.state.votePos = WA.state.voteNeg = WA.state.voteNeut = 0,
    },
]

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.onEnterLayer('votePos').subscribe(() => {
        console.log("VotePos: ", WA.state.votePos);
		(WA.state.votePos as number) ++;
	})
	WA.room.onLeaveLayer('votePos').subscribe(()  => {
        console.log("VotePos: ", WA.state.votePos);
        if(WA.state.votePos as number === 0) return ;
		(WA.state.votePos as number) --;
	})
	WA.room.onEnterLayer('voteNeg').subscribe(()  => {
        console.log("voteNeg: ", WA.state.voteNeg);
		(WA.state.voteNeg as number) ++;
	})
	WA.room.onLeaveLayer('voteNeg').subscribe(() => {
        console.log("voteNeg: ", WA.state.voteNeg);
        if(WA.state.voteNeg as number === 0) return ;
		(WA.state.voteNeg as number) --;
	})
	WA.room.onEnterLayer('voteNeut').subscribe(() => {
        console.log("voteNeut: ", WA.state.voteNeut);
		(WA.state.voteNeut as number) ++;
	})
	WA.room.onLeaveLayer('voteNeut').subscribe(() => {
        console.log("voteNeut: ", WA.state.voteNeut);
        if((WA.state.voteNeut as number) === 0) return ;
		(WA.state.voteNeut as number) --;
	})

    WA.room.onEnterLayer('voteReset').subscribe(() => {
        WA.ui.openPopup("resetPopup","Soll das Voting zurückgesetzt werden?", buttons);
    })
    // WA.room.onLeaveLayer('voteReset').subscribe(closePopUp)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

// function closePopUp(){
//     if (currentPopup !== undefined) {
//         currentPopup.close();
//         currentPopup = undefined;
//     }
// }

export {};
