const Organisation = require("../models/organisation");

const getAllOrganisations = async (req, res) => {
  try {
    const organisation = await Organisation.getAllOrganisations();
    res.json(organisation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving organisations");
  }
};

const getOrgByName = async (req, res) => {
  const OrgName = req.params.OrgName;
  try {
    const org = await Organisation.getOrgByName(OrgName);
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
  const OrgName = req.params.OrgName;
  const newOrgData = req.body;

  try {
    const updatedOrg = await Organisation.updateOrgProfile(OrgName, newOrgData);
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
  getOrgByName,
  updateOrgProfile,
};
