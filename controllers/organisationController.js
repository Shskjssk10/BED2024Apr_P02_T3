const Organisation = require("../models/organisation");

//Hendrik
const getAllOrganisations = async (req, res) => {
  try {
    const organisation = await Organisation.getAllOrganisations();
    res.json(organisation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving organisations");
  }
};

const getOrgById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const org = await Organisation.getOrgById(id);
    if (!org) {
      return res.status(404).send("Organisation not found");
    }
    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Organisation");
  }
};

const getOrgByName = async (req, res) => {
  const orgName = req.params.orgName;
  try {
    const org = await Organisation.getOrgByName(orgName);
    if (!org) {
      return res.status(404).send("Organisation not found");
    }
    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Organisation");
  }
};

const updateOrgProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;

  try {
    const updatedOrg = await Organisation.updateOrgProfile(id, updatedData);
    if (!updatedOrg) {
      return res.status(400).send("Organisation not found");
    }
    res.json(updatedOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating organisation");
  }
};

module.exports = {
  getAllOrganisations,
  getOrgById,
  getOrgByName,
  updateOrgProfile,
};
