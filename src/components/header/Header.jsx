import React, { useState, useRef } from "react";
import "../../stylesheet/Header/header.scss";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { findActiveBoard } from "../../features/boards/boardSlice";
import HeaderModal from "../modal/headerModal/HeaderModal";
// import { ReactComponent as Elips } from "../../assets/Icons/icon-vertical-ellipsis.svg";
import { ReactComponent as ChevUp } from "../../assets/icons/icon-chevron-up.svg";
import { ReactComponent as ChevDown } from "../../assets/icons/icon-chevron-down.svg";
// import { ReactComponent as LogoMobile } from "../../assets/Icons/logo-mobile.svg";

import { ReactComponent as LogoDark } from "../../assets/icons/logo-dark.svg";
import { ReactComponent as LogoLight } from "../../assets/icons/logo-light.svg";
// import { ReactComponent as Add } from "../../assets/Icons/icon-add-task-mobile.svg";
import DropdownSettings from "../extra/DropdownSettings";
import { openModal } from "../../features/global/modalSlice";

const Header = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const isMobileMax = useMediaQuery({ maxWidth: 650 });
  const tabletButton = useMediaQuery({ maxWidth: 773 });
  const [elipsisMobileOpen, setElipsisMobileOpen] = useState(false);
  const [elipsisDesktopOpen, setElipsisDesktopOpen] = useState(false);

  const elipsisRef = useRef();
  const elipsisRefDesktop = useRef();

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const activeBoard = useSelector(findActiveBoard);
  const sidebar = useSelector((state) => state.sidebar);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  const toggleModal = () => setModalOpen(!modalOpen);

  return (
    <div className="header bg-header">
      {isMobileMax ? (
        <div className="header-m">
          <div className={`header-m__left  | flex `}>
            <div className="header-m__logo | flex">
              {/* <LogoMobile /> */}
            </div>
            <div className="header-m__board | flex ">
              <h1 className="f-board-title-header">{activeBoard?.name}</h1>

              <div
                className="header-m__board__chevron"
                onClick={() => toggleModal()}
              >
                {/* {modalOpen ? (
                  <div onClick={open}>
                  <i class="fa-solid fa-chevron-up"/>
                  </div>
                ) : (
                    <div onClick={close}>
                  <i class="fa-solid fa-chevron-down"/>
                  </div>
                //   <ChevDown onClick={close} />
                )} */}
                {modalOpen ? (
                  <ChevUp onClick={open} />
                ) : (
                  <ChevDown onClick={close} />
                )}
              </div>
            </div>
          </div>
          <DropdownSettings
            isOpen={elipsisMobileOpen}
            setClose={setElipsisMobileOpen}
            elipsisRef={elipsisRef}
          />
          <div className="header-m__right | flex">
            <div
              onClick={() => {
                if (activeBoard?.columns?.length !== 0) {
                  dispatch(openModal("addTaskModal"));
                }
              }}
              className={`header-m__add ${
                activeBoard?.columns?.length === 0 && "btn-primary-disabled"
              } | flex " `}
            >
              {/* <Add /> */}
            </div>
            <div
              className="header-m__settings | flex"
              onClick={() => setElipsisMobileOpen(!elipsisMobileOpen)}
              ref={elipsisRef}
            >
              {/* <Elips style={{ cursor: "pointer" }} /> */}
            </div>
          </div>
          {modalOpen && (
            <HeaderModal modalOpen={modalOpen} handleClose={close} />
          )}
        </div>
      ) : (
        <div className="header-d | flex">
          <div
            className={`header-d__left  ${
              !sidebar && "header-d__left-border"
            } | flex`}
          >
            {theme.theme === "light" ? (
              <LogoDark style={{ marginLeft: "1.5em", marginTop: "2em" }} />
            ) : (
              <LogoLight style={{ marginLeft: "1.5em", marginTop: "2em" }} />
            )}
          </div>
          <DropdownSettings
            isOpen={elipsisDesktopOpen}
            setClose={setElipsisDesktopOpen}
            elipsisRef={elipsisRefDesktop}
          />
          <div className="header-d__right | flex">
            <h2 className="f-board-title-header header-d__right-title">
              {activeBoard?.name}
            </h2>
            <div className="header-d__right__settings | flex" style={{
                                marginTop: "26px",
                                width: "164px",
                                height: "48px",}}>
              {tabletButton ? (
                <div
                style={{
                  opacity: "0px",
                  padding: "10px",
                  backgroundColor: "#635FC7",
                  borderRadius: "50px",
                  color: "white",
              }}
                  onClick={() => {
                    if (activeBoard?.columns?.length !== 0) {
                      return;
                    }
                  }}
                  className={`header-d__right__settings-small-add  ${
                    activeBoard?.columns?.length === 0 && "btn-primary-disabled"
                  }`}
                >
                  {/* <Add /> */}
                </div>
              ) : (
                <div
                style={{
                  opacity: "0px",
                  padding: "10px",
                  backgroundColor: "#635FC7",
                  borderRadius: "50px",
                  color: "white",
                  cursor:"pointer",
              }}
                  onClick={() => {
                    if (activeBoard?.columns?.length !== 0) {
                      dispatch(openModal("addTaskModal"));
                    }
                  }}
                  className={`header-d__right__settings-add | btn-primary-l flex ${
                    activeBoard?.columns?.length === 0 && "btn-primary-disabled"
                  }`}
                 
                >
                  <span>+ Add new task</span>
                </div>
              )}
              <div
                className="flex"
                style={{ cursor: "pointer" }}
                onClick={() => setElipsisDesktopOpen(!elipsisDesktopOpen)}
                ref={elipsisRefDesktop}
              >
                {/* <Elips style={{ marginRight: "1.5em" }} /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
