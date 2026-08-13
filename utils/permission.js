const permission = [
  {
    role: "student",
    permission: [
      "caneditownprofile",
      "canedeleteownprofile",
      "canupdateownprofile",
    ],
  },
  {
    role: "teacher",
    permission: ["caneditresult", "candeleteresult", "canupdateresult"],
  },
  {
    role: "management",
    permission: ["all"]
  }
];

module.exports = permission
