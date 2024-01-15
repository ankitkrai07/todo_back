const e = require("express");
const express = require("express");
const { auth } = require("../middleware/auth");
const { NotesModel } = require("../model/notesModel");
const NotesRouter = express.Router();
NotesRouter.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: "The auto generated id of the user"
 *         title:
 *           type: string
 *           description: "The Title of the Note"
 *         body:
 *           type: string
 *           description: "The Body of the Note"
 */

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: All the API routes related to Note
 */

/**
 * @swagger
 * /notes/create:
 *   post:
 *     summary: Create a new note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *             example:
 *               title: Example Title
 *               body: This is an example note content.
 *     responses:
 *       200:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: New Note has been added
 *       401:
 *         description: Unauthorized or token not provided
 */

NotesRouter.post("/create", async (req, res) => {
  try {
    const NewNotes = new NotesModel(req.body);
    await NewNotes.save();
    res.send({ msg: "New Note has been added" });
  } catch (error) {
    res.send(error);
  }
});

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for a user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: List of notes for the user
 *         content:
 *           application/json:
 *             example:
 *               - _id: noteId1
 *                 title: Note 1
 *                 body: This is the content of note 1.
 *               - _id: noteId2
 *                 title: Note 2
 *                 body: This is the content of note 2.
 *       401:
 *         description: Unauthorized or token not provided
 *       404:
 *         description: No notes found for the user
 */

NotesRouter.get("/", async (req, res) => {
  try {
    const notes = await NotesModel.find({ userId: req.body.userId });
    if (notes) {
      res.send(notes);
    } else {
      res.send("No notes are present");
    }
  } catch (error) {
    res.send(error);
  }
});

/**
 * @swagger
 * notes/update/{note_id}:
 *   patch:
 *     summary: Update a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the note to update
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           description: Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *             example:
 *               title: Updated Title
 *               body: This is the updated content of the note.
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: Note has been Updated
 *       401:
 *         description: Unauthorized or token not provided
 *       403:
 *         description: User is not authorized to update the note
 *       404:
 *         description: Note not found
 */


NotesRouter.patch("/update/:note_id", async (req, res) => {
  const { note_id } = req.params;
  const note = await NotesModel.find({ _id: note_id, userId: req.body.userId });
  try {
    if (!note) {
      res.send("You are not Authorized");
    } else {
      await NotesModel.findByIdAndUpdate({ _id: note_id }, req.body);
      res.send({ msg: "Notes has been Updated" });
    }
  } catch (error) {
    res.send(error);
  }
});

/**
 * @swagger
 * notes/delete/{note_id}:
 *   delete:
 *     summary: Delete a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: note_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the note to delete
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: Note is Deleted
 *       401:
 *         description: Unauthorized or token not provided
 *       403:
 *         description: User is not authorized to delete the note
 *       404:
 *         description: Note not found
 */


NotesRouter.delete("/delete/:note_id", async (req, res) => {
  const { note_id } = req.params;
  const note = await NotesModel.find({ _id: note_id, userId: req.body.userId });
  try {
    if (!note) {
      res.send("You are not Authorized");
    } else {
      await NotesModel.findByIdAndDelete({ _id: note_id });
      res.send({ msg: "Notes is Deleted" });
    }
  } catch (error) {
    res.send(error);
  }
});
module.exports = {
  NotesRouter,
};
