import React, { useEffect, useRef, useState } from 'react';

import { Router, Route,  } from "react-router";

import fire from './config/fire.js';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import LeftNav from './LeftNavigation.js';

const firestore = fire.firestore();
const auth = fire.auth();
const analytics = fire.analytics();


function Profile(){


    

        return(
            <div>
            <LeftNav />
                <p>hi</p>
            </div>
        )

}
export default Profile;