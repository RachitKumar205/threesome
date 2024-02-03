import Image from "next/image"
import arrowDarkSvg from "@/public/arrow-dark.svg"

export default function Compass({northReset, waypointHeading, testOffset}) {
  return (
    <div className="compass">
      <Image
        src={arrowDarkSvg}
        style={{transform: `rotate(${northReset + waypointHeading + testOffset}deg)`}}
      />
      <p>waypointHeading - {waypointHeading}</p>
      <p>testOffset - {testOffset}</p>

      <p>1+2 - {(waypointHeading + testOffset) - 360 * (Math.floor((waypointHeading + testOffset)/360))}</p>
      <hr/>
    </div>   
  )
}