import React, { useState } from 'react';
import router from 'next/router'

import { NavBar, Card} from 'antd-mobile'



export default function Avatar() {

    const back = () => {
        router.back()
    }
    return(
        <>
        <NavBar back='返回' onBack={back}>
          头像设置
        </NavBar>
        <Card style={{backgroundColor:'rgb(130, 191, 166)'}}>


        </Card>

        </>

    )    
}
