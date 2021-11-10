import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import PersonIcon from "@material-ui/icons/Person"
import ListAltIcon from "@material-ui/icons/ListAlt"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import { useHistory } from "react-router";
import { useSelector } from "react-redux";


const UserOptions = ({ user }) => {
    const { cartItems } = useSelector((state) => state.cart);

    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        {
            icon: (
                <ShoppingCartIcon
                    style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
                />
            ),
            name: `Cart(${cartItems.length})`,
            func: cart,
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];
    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }


    const history = useHistory();

    function dashboard() {
        history.push("/admin/dashboard");
    }

    function orders() {
        history.push("/orders");
    }
    function account() {
        history.push("/account");
    }
    function cart() {
        history.push("/cart");
    }
    function logoutUser() {
        // dispatch(logout());
        alert.success("Logout Successfully");
    }

    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                direction="down"
                icon={
                    <img src={user.avatar.url}
                        className="speedDialIcon"
                        alt="Profile" />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    );
};

export default UserOptions;
