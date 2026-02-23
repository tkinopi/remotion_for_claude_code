import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./MyComposition";
import { TelopVideo } from "./TelopVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="telop-video"
        component={TelopVideo}
        durationInFrames={19616}
        fps={25}
        width={1920}
        height={1080}
      />
    </>
  );
};
