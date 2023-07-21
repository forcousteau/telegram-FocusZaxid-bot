import React, { useContext, useEffect, useState } from "react";
import { Badge, Button, message, Select, Table, Typography } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import ObjectsCreator from "./ObjectCreator";

import { getColumnSearchProps } from "../../../helpers/tableSearch";
import { editObject, fetchObjects } from "../../../api/objects";
import { IObject } from "../../../types/objects";
import Loading from "../../Loading";
import { IContractor } from "../../../types/contractors";
import { fetchContractors } from "../../../api/contractors";
import { IRegion } from "../../../types/regions";
import { fetchRegions } from "../../../api/regions";
import AuthContext from "../../../contexts/AuthContext";

const ObjectsTable: React.FC = () => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState<IObject[]>();
  const [contractors, setContractors] = useState<IContractor[]>();
  const [regions, setRegions] = useState<IRegion[]>();

  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    setLoading(true);

    try {
      const [objects, contractors, regions] = await Promise.all([
        fetchObjects(),
        fetchContractors(),
        fetchRegions(),
      ]);

      setObjects(objects);
      setContractors(contractors);
      setRegions(regions);
    } catch (err) {
      console.error(err);
      message.error("Не вдалось отримати дані");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async (id: number, data: Partial<IObject>) => {
    try {
      await editObject(id, data);
    } catch (err) {
      console.error(err);
      message.error("Не вдалось відредагувати об'єкт");
    } finally {
      updateData();
    }
  };

  const columns = [
    {
      title: "Назва",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (_, { id, address }) => (
        <Typography.Text
          editable={
            !writeAccess
              ? false
              : {
                  onChange: (address) => onEdit(id, { address }),
                }
          }
        >
          {address}
        </Typography.Text>
      ),
      ...getColumnSearchProps("address", setSearchText, setSearchedColumn),
    },
    {
      title: "Місто",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (_, { id, city }) => (
        <Typography.Text
          editable={
            !writeAccess
              ? false
              : {
                  onChange: (city) => onEdit(id, { city }),
                }
          }
        >
          {city}
        </Typography.Text>
      ),
      ...getColumnSearchProps("city", setSearchText, setSearchedColumn),
    },
    {
      title: "Регіон",
      dataIndex: "regionName",
      key: "regionName",
      sorter: (a, b) => a.regionName.localeCompare(b.regionName),
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "ascend",
      showSorterTooltip: false,
      render: (_, { id, regionId, regionName }) => {
        if (loading) return <Loading />;

        if (writeAccess) {
          return (
            <Select
              loading={loading}
              defaultValue={regionId ?? "Не задано"}
              notFoundContent="Не вдалося отримати регіони"
              onChange={(regionId) => onEdit(id, { regionId })}
            >
              {
                // @ts-ignore
                <Select.Option key={"null"} value={null}>
                  Не задано
                </Select.Option>
              }
              {regions?.map(({ id, name }) => {
                return (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                );
              })}
            </Select>
          );
        } else {
          return regionName ?? "Не задано";
        }
      },
      ...getColumnSearchProps("regionName", setSearchText, setSearchedColumn),
    },
    {
      title: "Виконроб",
      dataIndex: "contractorName",
      key: "contractorName",
      sorter: (a, b) => a.contractorName?.localeCompare(b.contractorName),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (_, { id, contractorId, contractorName }) => {
        if (loading) return <Loading />;

        if (writeAccess) {
          return (
            <Select
              loading={loading}
              defaultValue={contractorId ?? "Не задано"}
              notFoundContent="Не вдалося отримати виконробів"
              onChange={(contractorId) => onEdit(id, { contractorId })}
            >
              {
                // @ts-ignore
                <Select.Option key={"null"} value={null}>
                  Не задано
                </Select.Option>
              }
              {contractors?.map(({ id, fullName }) => {
                return (
                  <Select.Option key={id} value={id}>
                    {fullName}
                  </Select.Option>
                );
              })}
            </Select>
          );
        } else {
          return contractorName ?? "Не задано";
        }
      },
      ...getColumnSearchProps(
        "contractorName",
        setSearchText,
        setSearchedColumn
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => +a.isActive - +b.isActive,
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      responsive: ["lg"],
      filters: [
        {
          text: "Активні",
          value: "true",
        },
        {
          text: "Неактивні",
          value: "false",
        },
      ],
      onFilter: (value, { isActive }) => isActive.toString() === value,
      render: (_, { isActive }) => {
        const status = isActive ? "processing" : "warning";
        const text = isActive ? "Активний" : "Неактивний";

        return <Badge status={status} text={text} />;
      },
    },
    {
      title: "Чи оплачується відстань до об`єкта",
      dataIndex: "isDriveCompensated",
      key: "isDriveCompensated",
      sorter: (a, b) => +a.isDriveCompensated - +b.isDriveCompensated,
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      filters: [
        {
          text: "Так",
          value: "true",
        },
        {
          text: "Ні",
          value: "false",
        },
      ],
      onFilter: (value, { isDriveCompensated }) =>
        isDriveCompensated.toString() === value,
      render: (_, { id, isDriveCompensated }) => {
        if (loading) return <Loading />;

        if (writeAccess) {
          return (
            <Select
              loading={loading}
              defaultValue={isDriveCompensated ?? "Не задано"}
              notFoundContent="Не вдалося отримати інформацію"
              onChange={(isDriveCompensated) =>
                onEdit(id, { isDriveCompensated })
              }
            >
              {
                // @ts-ignore
                <Select.Option key={isDriveCompensated} value={true}>
                  Так
                </Select.Option>
              }
			  {
                // @ts-ignore
                <Select.Option key={isDriveCompensated} value={false}>
                  Ні
                </Select.Option>
              }
            </Select>
          );
        } else {
			const status = isDriveCompensated ? "processing" : "error";
			const text = isDriveCompensated ? "Так" : "Ні";
	
			return <Badge status={status} text={text} />;
        }
      },
    },
	{
		title: 'Відстань',
		dataIndex: 'distanceInKM',
		key: 'distanceInKM',
		sorter: (a, b) => a.distanceInKM - b.distanceInKM,
		sortDirections: ['descend', 'ascend'],
		showSorterTooltip: false,
		render: (_, { id, distanceInKM }) => (
		  <Typography.Text editable={!writeAccess ? false : {
			onChange: distanceInKM => {
			  const numMatch = distanceInKM.match(/\d+/g);
  
			  if (numMatch) {
				return onEdit(id, { distanceInKM: +numMatch[0] })
			  }
			}
		  }}>
			{`${distanceInKM} км`}
		  </Typography.Text>
		),
		...getColumnSearchProps('distanceInKM', setSearchText, setSearchedColumn)
	  },
  ];

  if (writeAccess) {
    columns.push({
      title: "Дія",
      dataIndex: "action",
      key: "action",
      responsive: ["lg"],
      // @ts-ignore
      render: (_, { id, isActive }) => {
        const buttonText = isActive ? "Деактивувати" : "Активувати";
        return (
          <a onClick={() => onEdit(id, { isActive: !isActive })}>
            {buttonText}
          </a>
        );
      },
    });
  }

  return (
    <div className="ObjectsTable">
      {writeAccess && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusCircleFilled />}
            onClick={() => setCreatorVisible(true)}
          >
            Створити
          </Button>
        </div>
      )}

      <Table
        loading={loading}
        //@ts-ignore
        columns={columns}
        dataSource={objects}
        rowKey="id"
        locale={{
          filterReset: "Скинути",
          filterConfirm: "ОК",
          emptyText: "Нічого не знайдено",
        }}
      />

      {writeAccess && (
        <ObjectsCreator
          visible={creatorVisible}
          onCancel={() => setCreatorVisible(false)}
          afterSubmit={updateData}
        />
      )}
    </div>
  );
};

export default ObjectsTable;
