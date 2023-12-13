import React, { createContext, useState, useEffect, useContext } from "react";
import scenarioStyles from "../pages/Scenario.module.css";
import { images } from '../AssetLibrary';

const character = images.ORACLE_DEFAULT;

export default function Oracle(props) {
    const { showOracle, setShowOracle, speech } = props;

    const style = { position: 'absolute', right: 20, bottom: 20, fontSize: 20 };
    if (!showOracle) {
        return (
            <div style={{
                ...style,
                cursor: 'pointer',
                border: '1px solid',
                padding: '10px',
                borderRadius: '5px'
            }} onClick={() => setShowOracle(true)}>
                Get help from oracle 🆘
            </div>
        );
    }

    return (
        <div style={style}>
            <img src={character} style={{
                width: 100, height: 100,
                marginBottom: '-10px',
                width: '100px',
                height: '100px',
                position: 'absolute',
                right: '0',
                top: '-100px'
            }} />
            <p className={[scenarioStyles.speech, scenarioStyles.oracle].join(" ")}>
                {speech || 'Hello, I am the Oracle. You can sometimes get help from me by clicking down here.'}
            </p>
            <div onClick={() => setShowOracle(false)} style={{ position: 'absolute', top: -10, right: 0, cursor: 'pointer' }}>❌</div>
        </div>
    );
};

export function useOracle(speech) {
    const { setOracleSpeech, setShowOracle } = useContext(OracleContext);

    useEffect(() => {
        setShowOracle(false);
        setOracleSpeech(speech);
    }, []);

    return { setOracleSpeech, setShowOracle };
}

export const OracleContext = createContext(null);

