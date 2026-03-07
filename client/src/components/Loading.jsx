import * as React from "react"
import { OrbitProgress } from "react-loading-indicators";


const Loading = () =>{
    return(
        <div>
            <div className="h-screen w-full flex items-center justify-center">
                <OrbitProgress variant="track-disc" dense color={["#4285F4","#0F9D58","#F4B400","#BD437"]} size="large" easing="ease-in-out" speedPlus="3" text="" textColor="" />
            </div>
        </div>
    )
}

export default Loading;