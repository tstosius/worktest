/// <reference types='@workadventure/iframe-api-typings' />

import { UIWebsite } from "@workadventure/iframe-api-typings/Api/Events/ui/UIWebsite";
import { RemotePlayerInterface } from "@workadventure/iframe-api-typings/Api/Iframe/Players/RemotePlayer";
import { playerState } from "@workadventure/iframe-api-typings/Api/Iframe/playerState";
import { ButtonDescriptor } from "@workadventure/iframe-api-typings/Api/iframe/Ui/ButtonDescriptor";
import { Popup } from "@workadventure/iframe-api-typings/Api/iframe/Ui/Popup";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
console.log("Script started successfully");

// let currentPopup: any = undefined;
const buttons: ButtonDescriptor[] = [
  {
    label: "Reset",
    className: "error",
    callback: () =>
      (WA.state.votePos = WA.state.voteNeg = WA.state.voteNeut = 0),
  },
];

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    let website: UIWebsite;
    WA.room.onEnterLayer("infoPopup").subscribe(() => {
      openInfoWebsite().then((_website) => (website = _website));
    });

    WA.room.onLeaveLayer("infoPopup").subscribe(() => {
      website.visible = false;
    });

    WA.room.onEnterLayer("votePos").subscribe(() => {
      console.log("VotePos: ", WA.state.votePos);
      (WA.state.votePos as number)++;
    });
    WA.room.onLeaveLayer("votePos").subscribe(() => {
      console.log("VotePos: ", WA.state.votePos);
      if ((WA.state.votePos as number) === 0) return;
      (WA.state.votePos as number)--;
    });
    WA.room.onEnterLayer("voteNeg").subscribe(() => {
      console.log("voteNeg: ", WA.state.voteNeg);
      (WA.state.voteNeg as number)++;
    });
    WA.room.onLeaveLayer("voteNeg").subscribe(() => {
      console.log("voteNeg: ", WA.state.voteNeg);
      if ((WA.state.voteNeg as number) === 0) return;
      (WA.state.voteNeg as number)--;
    });
    WA.room.onEnterLayer("voteNeut").subscribe(() => {
      console.log("voteNeut: ", WA.state.voteNeut);
      (WA.state.voteNeut as number)++;
    });
    WA.room.onLeaveLayer("voteNeut").subscribe(() => {
      console.log("voteNeut: ", WA.state.voteNeut);
      if ((WA.state.voteNeut as number) === 0) return;
      (WA.state.voteNeut as number)--;
    });

    let voteResetPopup: Popup;
    WA.room.onEnterLayer("voteRes").subscribe(() => {
      voteResetPopup = WA.ui.openPopup(
        "resetPopup",
        "Soll das Voting zurückgesetzt werden?",
        buttons
      );
    });
    WA.room.onLeaveLayer("voteRes").subscribe(() => {
      voteResetPopup.close();
    });

    WA.chat.onChatMessage((message) => {
      if (message === "move") {
        getNearbyPlayer();
      }
    });


    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

async function openInfoWebsite(): Promise<UIWebsite> {
  return await WA.ui.website.open({
    url: "http://localhost:3000/info.html",
    position: {
      vertical: "middle",
      horizontal: "middle",
    },
    size: {
      width: "50vh",
      height: "50vh",
    },
  });
}

async function getNearbyPlayer() {
  console.log("Started tracking");
  await WA.players.configureTracking();
  WA.players.onPlayerEnters.subscribe((player: RemotePlayerInterface) => {
    console.log(`Player ${JSON.stringify(player)} entered your nearby zone`);
    player.position.x = player.position.x + 500;
  });
  WA.players.onPlayerLeaves.subscribe((player: RemotePlayerInterface) => {
    console.log(`Player ${JSON.stringify(player)} left your nearby zone`);
  });

  const pos = await WA.player.getPosition();
  WA.player.moveTo(pos.x, pos.y + 10);
}

export {};
