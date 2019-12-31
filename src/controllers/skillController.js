import Skill from '../models/skill';
import mongoose from 'mongoose';

const SkillController = {};

SkillController.getAll = async (req, res) => {
  await Skill.find().sort('-createdAt').exec((err, skills) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.json({ skills });
  });
}

SkillController.getSkill = async (req, res) => {
  const validSkillId = mongoose.Types.ObjectId.isValid(req.params.skillId);
  if (!validSkillId) {
    return res.status(400).send({ error: "Malformed ID" });
  }
  await Skill.findById(req.params.skillId).exec((err, skill) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!skill) {
      return res.status(404).send();
    }
    return res.send({ skill });
  });
}

SkillController.addSkill = async (req, res) => {
  const skill = new Skill(req.body.skill);

  await skill.save(function (err) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.send({ skill });
  });
}

SkillController.updateSkill = async (req, res) => {
  if (!req.body.skill) {
    return res.status(400).send({ error: "No data sent" });
  }
  const validSkillId = mongoose.Types.ObjectId.isValid(req.params.skillId);
  if (!validSkillId) {
    return res.status(400).send({ error: "Malformed ID" });
  }

  try {
    const newValues = { $set: req.body.skill };
    const skill = await Skill.findByIdAndUpdate(req.params.skillId, newValues,
      { runValidators: true, context: 'query' });

    if (!skill) {
      return res.status(404).send();
    }
    return res.send({ skill });
  } catch (err) {
    return res.status(500).send(err);
  }


}

SkillController.deleteSkill = async (req, res) => {
  const validSkillId = mongoose.Types.ObjectId.isValid(req.params.skillId);
  if (!validSkillId) {
    return res.status(400).send({ error: "Malformed ID" });
  }
  await Skill.findById(req.params.skillId).exec((err, skill) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!skill) {
      return res.status(404).send();
    }
    skill.remove(() => {
      return res.status(200).send();
    });
  });
}

export default SkillController;