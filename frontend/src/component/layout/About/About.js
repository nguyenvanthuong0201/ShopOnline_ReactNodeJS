import React from "react";
import "./About.css";
import {Typography, Avatar } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
const About = () => {
    return (
        <div className="aboutSection">
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About Us</Typography>
                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://res.cloudinary.com/gia-dinh/image/upload/v1637038088/avatar_f4e3v4.jpg"
                            alt="Founder"
                        />
                        <Typography>Thuong Nguyen</Typography>
                    </div>
                    <div className="aboutSectionContainer2">
                        <Typography component="h2">Information</Typography>
                        <a
                            href="https://www.facebook.com/thuoggdan"
                            target="blank"
                        >
                            <FacebookIcon className="FbSvgIcon" />
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;