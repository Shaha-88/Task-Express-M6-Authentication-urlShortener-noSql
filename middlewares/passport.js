require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;

const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;

const JWTStrategy = require("passport-jwt").Strategy;

exports.jwtStrategy = new JWTStrategy(
    {
      jwtFromRequest: fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    }),
    
    async (jwtPayload, done) => {
      
      if (Date.now() / 1000 > jwtPayload.exp) {
        return done(null, false); 
      }

      try {
        const user = await User.findById(jwtPayload.id);
        if (!user) {
          return done("USER NOT FOUND!");
        }
        done(null, user); 
      } catch (error) {
        done(error);
      }
    }
  exports.localStrategy = new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
  
    async (username, password, done) => {
      try {
        
        const user = await User.findOne({
          username: username, 
        
        });
        
  
        if (user) {
          
          let passwordMatch = bcrypt.compare(password, user.password);
         
          if (passwordMatch) {
            return done(null, user); 
          } else {
            return done({ msg: "THE USERNAME OR PASSWORD IS WRONG!" }, false);
          }
        } else {
         
          return done({ msg: "THE USERNAME OR PASSWORD IS WRONG!" }, false);
        }
  
       
      } catch (error) {
        done(error);
      }
    }
  );
  
  