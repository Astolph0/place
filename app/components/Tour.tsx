import { Tour as TheRealTour } from "antd";
import React from "react";
import { RefObject } from "react";

export default function Tour(params: {
  start: boolean;
  menuButton: RefObject<HTMLElement>;
  exit: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
	sidebarOpen: boolean;
}) {
	const [tourIndex, setTourIndex] = React.useState(0)
	console.log('tour index', tourIndex)
	console.log('tourIndex < 3', tourIndex < 3)
	console.log('tourIndex > 7', tourIndex > 7)
	console.log('params.start', params.start)
	console.log('params.sidebarOpen', params.sidebarOpen)

	if (params.start && params.sidebarOpen) {
		params.closeSidebar()
	}
	
  return (
    <>
      <TheRealTour
        animated
        open={params.start}
        onClose={params.exit}
				onFinish={() => {
					params.exit()
					params.openSidebar()
					setTourIndex(0)
				}}
				current={tourIndex}
				onChange={x => setTourIndex(x)}
        steps={[
          {
            title: "Welcome to place by Astolfo!",
            description:
              "This is a clone of the original r/place, made by Astolfo himself.",
            target: null,
          },
          {
            title: "The Map",
            description:
              "The map is a 100x100 grid of tiles. Each tile can be coloured by clicking on it. You can place one tile every 5 minutes.",
            target: null,
          },
          {
            title: "The Sidebar",
            description: "This is the button to open the sidebar.",
            target: params.menuButton.current,
            placement: "bottom",
          },
					{
						title: 'Selected tile window',
						description: <>
							<img src="/tut1.png" />
							<br />
							<span>This is how the selected tile window looks like. You can see the position, colour of the tile, and the user who placed it.</span>
						</>,
						target: null
					},
					{
						title: 'Place tile window',
						description: <>
							<img src="/tut2.png" />
							<br />
							<span>This is the place window looks like. You switch to it using the tabs on the top of the selected tile window. You select a colour and hit OK to set a colour.</span>
						</>,
						target: null
					}
        ]}
      />
    </>
  );
}
