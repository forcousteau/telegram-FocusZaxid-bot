import React, { useContext, useEffect, useState } from "react";
import { Badge, Button, message, Select, Table, Typography } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import CarCreator from "./CarCreator";

import { getColumnSearchProps } from "../../../helpers/tableSearch";
import Loading from "../../Loading";
import AuthContext from "../../../contexts/AuthContext";
import { FuelType, ICar } from "../../../types/cars";
import { editCar, fetchCars } from "../../../api/cars";

const CarsTable: React.FC = () => {
  const fuelTypes = [
    {
      text: "Бензин",
      value: FuelType.PETROL,
    },
    {
      text: "Дизель",
      value: FuelType.DIESEL,
    },
    {
      text: "Газ",
      value: FuelType.GAS,
    },
  ];
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;

  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<ICar[]>();

  const [creatorVisible, setCreatorVisible] = useState(false);

  const [searchedColumn, setSearchedColumn] = useState();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    setLoading(true);

    try {
      const [cars] = await Promise.all([fetchCars()]);

      setCars(cars);
    } catch (err) {
      console.error(err);
      message.error("Не вдалось отримати дані");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async (id: number, data: Partial<ICar>) => {
    try {
      await editCar(id, data);
    } catch (err) {
      console.error(err);
      message.error("Не вдалось відредагувати автомобіль");
    } finally {
      updateData();
    }
  };

  const columns = [
    {
      title: "Назва автомобіля",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (_, { id, name }) => (
        <Typography.Text
          editable={
            !writeAccess
              ? false
              : {
                  onChange: (name) => onEdit(id, { name }),
                }
          }
        >
          {name}
        </Typography.Text>
      ),
      ...getColumnSearchProps("name", setSearchText, setSearchedColumn),
    },
    {
      title: "Тип палива",
      dataIndex: "fuelType",
      key: "fuelType",
      sorter: (a, b) => a.fuelType.localeCompare(b.fuelType),
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      filters: fuelTypes,
      onFilter: (value, { fuelType }) => fuelType.toString() === value,
      render: (_, { id, fuelType }) => {
        if (loading) return <Loading />;

        if (writeAccess) {
          return (
            <Select
              defaultValue={fuelType ?? "Не задано"}
              loading={loading}
              notFoundContent="Не вдалося отримати інформацію"
              onChange={(fuelType) => onEdit(id, { fuelType })}
            >
              {fuelTypes.map(({text, value}) => {
                return (
                  <Select.Option key={"fuelType"} value={value}>
                    {text}
                  </Select.Option>
                );
              })}
            </Select>
          );
        } else {
          return fuelType ?? "Не задано";
        }
      },
    },
    {
      title: "Витрата палива",
      dataIndex: "fuelConsumption",
      key: "fuelConsumption",
      sorter: (a, b) => a.fuelConsumption - b.fuelConsumption,
      sortDirections: ["descend", "ascend"],
      showSorterTooltip: false,
      render: (_, { id, fuelConsumption }) => (
        <Typography.Text
          editable={
            !writeAccess
              ? false
              : {
                  onChange: (fuelConsumption) => {
                    const numMatch = fuelConsumption.match(/\d+/g);

                    if (numMatch) {
                      return onEdit(id, { fuelConsumption: +numMatch[0] });
                    }
                  },
                }
          }
        >
          {`${fuelConsumption} л`}
        </Typography.Text>
      ),
      ...getColumnSearchProps(
        "fuelConsumption",
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
          text: "Активний",
          value: "true",
        },
        {
          text: "Неактивний",
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
      title: "Власність фірми",
      dataIndex: "isCompanyProperty",
      key: "isCompanyProperty",
      sorter: (a, b) => +a.isCompanyProperty - +b.isCompanyProperty,
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
      onFilter: (value, { isCompanyProperty }) =>
        isCompanyProperty.toString() === value,
      render: (_, { id, isCompanyProperty }) => {
        if (loading) return <Loading />;

        if (writeAccess) {
          return (
            <Select
              loading={loading}
              defaultValue={isCompanyProperty ?? "Не задано"}
              notFoundContent="Не вдалося отримати інформацію"
              onChange={(isCompanyProperty) =>
                onEdit(id, { isCompanyProperty })
              }
            >
              {
                // @ts-ignore
                <Select.Option key={isCompanyProperty} value={true}>
                  Так
                </Select.Option>
              }
              {
                // @ts-ignore
                <Select.Option key={isCompanyProperty} value={false}>
                  Ні
                </Select.Option>
              }
            </Select>
          );
        } else {
          const status = isCompanyProperty ? "processing" : "error";
          const text = isCompanyProperty ? "Так" : "Ні";

          return <Badge status={status} text={text} />;
        }
      },
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
    <div className="CarsTable">
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
        dataSource={cars}
        rowKey="id"
        locale={{
          filterReset: "Скинути",
          filterConfirm: "ОК",
          emptyText: "Нічого не знайдено",
        }}
      />

      {writeAccess && (
        <CarCreator
          visible={creatorVisible}
          onCancel={() => setCreatorVisible(false)}
          afterSubmit={updateData}
          fuelTypes={fuelTypes}
        />
      )}
    </div>
  );
};

export default CarsTable;
