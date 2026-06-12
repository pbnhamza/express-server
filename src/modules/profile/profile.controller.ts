import type { Request, Response } from "express";
import { profileServer } from "./profile.server";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileServer.createProfileIntoDB(req.body);
    
    res.status(201).json({
      success: true,
      message: "Profile Create Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const profileController = {
  createProfile,
};
