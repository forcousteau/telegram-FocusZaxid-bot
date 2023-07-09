import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Form, InputNumber, message, Modal } from "antd";
import { useForm } from "antd/es/form/Form";

import { IVariable } from "../../../types/vars";
import { editVariable, fetchVariables } from "../../../api/vars";

const Settings: React.FC = () => {
  const [form] = useForm();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [vars, setVars] = useState<IVariable[]>();

  const updateData = async () => {
    setLoading(true);

    try {
      const vars = await fetchVariables();
      setVars(vars);
    } catch (err) {
      console.error(err);
      message.error("Не вдалось отримати налаштування");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateData().then(() => form.resetFields());
  }, []);

  const onSubmit = async (values) => {
    try {
      const updates: Promise<void>[] = [];

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const varId = vars?.find((v) => v.name === key)?.id;
          updates.push(
            editVariable(varId ?? null, {
              name: key,
              value: values[key].toString(),
            })
          );
        }
      }

      await Promise.all(updates);
      message.success("Налаштування успішно оновлені!");
    } catch (err) {
      console.error(err);
      message.error("Не вдалось оновити налаштування");
    } finally {
      updateData().then(() => form.resetFields());
      onCancel();
    }
  };

  const onCancel = () => history.push("/");

  return (
    <div className="Settings">
      <Modal
        title="Налаштування"
        okText="Зберегти"
        cancelText="Відмінити"
        destroyOnClose={true}
        visible={true}
        onCancel={onCancel}
        onOk={form.submit}
      >
        <Form
          form={form}
          initialValues={{
            hoursAutoCloseWorkShift: vars?.find((v) => v.name === "hoursAutoCloseWorkShift")?.value,
            hoursCloseWorkShiftReminder: vars?.find((v) => v.name === "hoursCloseWorkShiftReminder")?.value,
            pricePerKM: vars?.find((v) => v.name === "pricePerKM")?.value,
            suspensionPrice: vars?.find((v) => v.name === "suspensionPrice")?.value,
            petrolPrice: vars?.find((v) => v.name === "petrolPrice")?.value,
            dieselPrice: vars?.find((v) => v.name === "dieselPrice")?.value,
            gasPrice: vars?.find((v) => v.name === "gasPrice")?.value,
            electroPrice: vars?.find((v) => v.name === "electroPrice")?.value,
          }}
          onFinish={onSubmit}
        >
          <Form.Item
            name="hoursAutoCloseWorkShift"
            label="К-сть годин для автоматичного закриття зміни"
            rules={[
              {
                required: true,
                message:
                  "Необхідно встановити к-сть годин для автоматичного закриття зміни!",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="hoursCloseWorkShiftReminder"
            label="К-сть годин для нагадування про закриття зміни"
            rules={[
              {
                required: true,
                message:
                  "Необхідно встановити к-сть годин для нагадування про закриття зміни!",
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="pricePerKM"
            label="Виплата за 1 км"
            rules={[
              {
                required: true,
                message:
                  "Необхідно встановити ціну одного км користування машиною",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="suspensionPrice"
            label="Ціна за амортизацію"
            rules={[
              {
                required: true,
                message: "Необхідно встановити ціну амортизації",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="petrolPrice"
            label="Вартість одного літру бензину"
            rules={[
              {
                required: true,
                message: "Необхідно встановити ціну бензину",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="dieselPrice"
            label="Вартість одного літру дизелю"
            rules={[
              {
                required: true,
                message: "Необхідно встановити ціну дизелю",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="gasPrice"
            label="Вартість одного літру газу"
            rules={[
              {
                required: true,
                message: "Необхідно встановити ціну газу",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="electroPrice"
            label="Вартість 1кВ електроенергії"
            rules={[
              {
                required: true,
                message: "Необхідно встановити ціну електроенергії",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;
