import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import axios from "axios";

export function Tables() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/listusers");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["First Name", "Last Name", "Email", "Created At"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, key) => {
                const className = `py-3 px-5 ${
                  key === users.length - 1 ? "" : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={user.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${user.first_name}&background=random`}
                          alt={user.first_name}
                          size="sm"
                          variant="rounded"
                        />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {user.first_name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.last_name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user.email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;




{/* <Card>
<CardHeader variant="gradient" color="gray" className="mb-8 p-6">
  <Typography variant="h6" color="white">
    Projects Table
  </Typography>
</CardHeader>
<CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
  <table className="w-full min-w-[640px] table-auto">
    <thead>
      <tr>
        {["companies", "members", "budget", "completion", ""].map(
          (el) => (
            <th
              key={el}
              className="border-b border-blue-gray-50 py-3 px-5 text-left"
            >
              <Typography
                variant="small"
                className="text-[11px] font-bold uppercase text-blue-gray-400"
              >
                {el}
              </Typography>
            </th>
          )
        )}
      </tr>
    </thead>
    <tbody>
      {projectsTableData.map(
        ({ img, name, members, budget, completion }, key) => {
          const className = `py-3 px-5 ${
            key === projectsTableData.length - 1
              ? ""
              : "border-b border-blue-gray-50"
          }`;

          return (
            <tr key={name}>
              <td className={className}>
                <div className="flex items-center gap-4">
                  <Avatar src={img} alt={name} size="sm" />
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                  >
                    {name}
                  </Typography>
                </div>
              </td>
              <td className={className}>
                {members.map(({ img, name }, key) => (
                  <Tooltip key={name} content={name}>
                    <Avatar
                      src={img}
                      alt={name}
                      size="xs"
                      variant="circular"
                      className={`cursor-pointer border-2 border-white ${
                        key === 0 ? "" : "-ml-2.5"
                      }`}
                    />
                  </Tooltip>
                ))}
              </td>
              <td className={className}>
                <Typography
                  variant="small"
                  className="text-xs font-medium text-blue-gray-600"
                >
                  {budget}
                </Typography>
              </td>
              <td className={className}>
                <div className="w-10/12">
                  <Typography
                    variant="small"
                    className="mb-1 block text-xs font-medium text-blue-gray-600"
                  >
                    {completion}%
                  </Typography>
                  <Progress
                    value={completion}
                    variant="gradient"
                    color={completion === 100 ? "green" : "gray"}
                    className="h-1"
                  />
                </div>
              </td>
              <td className={className}>
                <Typography
                  as="a"
                  href="#"
                  className="text-xs font-semibold text-blue-gray-600"
                >
                  <EllipsisVerticalIcon
                    strokeWidth={2}
                    className="h-5 w-5 text-inherit"
                  />
                </Typography>
              </td>
            </tr>
          );
        }
      )}
    </tbody>
  </table>
</CardBody>
</Card> */}