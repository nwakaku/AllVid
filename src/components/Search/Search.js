import React, { useState, useRef, useEffect } from "react";
import PopperWrapper from "~/components/Popper/Wrapper";
import AccountItem from "~/features/accounts/components/AccountItem";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { FaSearch, FaSpinner, FaTimesCircle } from "react-icons/fa";
import styles from "./Search.module.scss";
import { searchService } from "~/services/searchService";
import { useDebounce } from "use-debounce";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/5cf626a98b0349f789b16075424370e7"
);

const useENS = () => {
  const [names, setNames] = useState();
  const [image, setImage] = useState();

  const getFile = (addr) => {
    provider.lookupAddress(addr).then((resolvedName) => {
      setNames(resolvedName);
      return resolvedName ?? addr;
    });
    provider.getAvatar(addr).then((resolvedName) => {
      setImage(resolvedName);
      return resolvedName ?? addr;
    });
  };

  return {
    names,
    image,
    getFile,
  };
};

function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchValue] = useDebounce(searchValue, 500);

  const { getFile, image, names } = useENS();

  const searchInput = useRef(null);

  const handleSearchValue = (e) => {
    const searchValue = e.target.value;
    if (searchValue[0] !== " ") {
      setSearchValue(e.target.value);
    }
  };

  const handleClear = () => {
    setSearchResult([]);
    setSearchValue("");
    searchInput.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
    setSearchValue("");
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    getFile(searchValue);
    setShowResult(true);
  };


  return (
    <div>
      <Tippy
        visible={showResult}
        interactive
        onClickOutside={handleHideResult}
        render={(attrs) => (
          <div className={styles.search_results} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <div className={styles.search_title}>Account</div>
              {console.log(names)}
              <AccountItem
                user={image}
                names={names}
                onClick={handleHideResult}
              />
            </PopperWrapper>
          </div>
        )}
      >
        <form className={styles.navbar_search} onSubmit={handleSubmit}>
          <input
            value={searchValue}
            className={styles.navbar_search_input}
            type="text"
            placeholder="Search accounts and videos"
            onChange={handleSearchValue}
            ref={searchInput}
            // onFocus={handleShowResult}
          ></input>
          {searchValue && !isLoading && (
            <button className={styles.clear} onClick={handleClear}>
              <FaTimesCircle />
            </button>
          )}
          {isLoading && <FaSpinner className={styles.loading} />}
          <span className={styles.navbar_search_line}></span>
          <button className={styles.navbar_search_icon}>
            <FaSearch />
          </button>
        </form>
      </Tippy>
    </div>
  );
}

export default Search;
