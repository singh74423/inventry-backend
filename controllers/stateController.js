import State from "../models/State.js";


// CREATE STATE
export const createState = async (req, res) => {
  try {

    const state = await State.create(req.body);

    res.status(201).json({
      success: true,
      data: state
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "State already exists"
      });
    }

    res.status(500).json({
      message: error.message
    });

  }
};



// GET STATES
export const getStates = async (req, res) => {
  try {

    const states = await State.find();

    res.status(200).json({
      success: true,
      count: states.length,
      data: states
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};