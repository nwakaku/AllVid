import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Sidebar.module.scss";
import { config } from "~/config";
import Button from "~/components/Core/Button";
import SuggestedList from "./SuggestedList";
import FollowingList from "./FollowingList";
import { useApolloProvider } from "~/context/ApolloContext"
import { useWalletProvider } from '../../context/WalletProvider';

import Menu from "./Menu/Menu";

function Sidebar() {
  const { apolloContext } = useApolloProvider();
  const { profiles, currentProfile } = apolloContext;
  const { smartAccountAddress, connect, disconnect, isLoggedIn, loading, walletProvider, account } = useWalletProvider();
  const [user, setUser] = useState();
  useEffect(() => {
    if(profiles !== undefined && profiles.length !== 0) {
      setUser(profiles[currentProfile]);
    }  
  }, [profiles, currentProfile]);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_scrollbar}>
        <Menu />
        <hr className={styles.hr} />
        {!isLoggedIn && (
          <>
            <div className={styles.sidebar_login}>
              <p className={styles.login_tip}>
                Connect wallet to follow creators, like videos, and collect
                videos as NFTs.
              </p>

              <Button
                outline
                large
                className={styles.button_login}
                onClick={connect}
              >
                Connect Wallet
              </Button>
            </div>
            <hr className={styles.hr} />
          </>
        )}

        {isLoggedIn && <SuggestedList />}

        {/* {user && <FollowingList />} */}

        <div className={styles.contact}>
          <p>Hackathon</p>
          <ul style={{ display: "flex", listStyle: "none" }}>
            <li style={{ marginRight: "1em" }}>Home</li>
            <li style={{ marginRight: "1em" }}>Following</li>
            <li style={{ marginRight: "1em" }}>Live Chat</li>
            <li style={{ marginRight: "1em" }}>some</li>
          </ul>
          <p>@ 2022 ALLVID FROM META</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
