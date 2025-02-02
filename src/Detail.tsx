import { useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator,
} from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  user: zfd
    .text(
      z.string({
        required_error: "필수값입니다",
      }),
    )
    .optional(),
  age: zfd
    .numeric(
      z
        .number({
          required_error: "필수값입니다",
          invalid_type_error: "숫자를 입력하세요",
        })
        .min(18, "18세 이상이어야 합니다"),
    )
    .optional(),
  gender: zfd.text(
    z.enum(["", "male", "female"], {
      required_error: "선택하세요",
    }),
  ),
  country: zfd.text(
    z.enum(["", "korea", "usa"], {
      required_error: "선택하세요",
    }),
  ),
  agree: zfd.repeatable(z.string().array().min(2, "모두 선택하세요")),
});

type SchemaType = z.infer<typeof schema>;

export const action = async (ctx: ActionFunctionArgs) => {
  console.log("액션은 폼을 받아주는 서버를 흉내내는 함수", ctx);
  await sleep(150);
  const formData = await ctx.request.formData();
  const report = schema.safeParse(formData);

  if (!report.success) {
    return {
      errors: report.error.flatten().fieldErrors,
    };
  }

  return redirect("/", 303);
};

const sleep = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const loader = async (ctx: LoaderFunctionArgs) => {
  console.log("로더는 페이지를 출력하는 서버를 흉내내는 함수", ctx);
  await sleep(150);

  const defaultValues: SchemaType = {
    user: undefined,
    age: undefined,
    gender: "",
    country: "",
    agree: [],
  };

  return defaultValues;
};

const useReset = () => {
  const revalidator = useRevalidator();
  const [key, setKey] = useState(new Date().getTime());
  const reset = async () => {
    setKey(key + 1);
    await revalidator.revalidate();
  };

  return { key, reset };
};

const Detail = () => {
  const actionData = useActionData();
  const initialData = useLoaderData<SchemaType>();
  const { key, reset } = useReset();
  const revalidator = useRevalidator();
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === "submitting" && <h1>폼을 보내는 중</h1>}
      {navigation.state === "loading" && <h1>초기값을 불러오는 중</h1>}
      {revalidator.state === "loading" && <h1>초기값을 다시 불러오는 중</h1>}
      <Form method="POST" key={key}>
        <fieldset>
          <legend>이름</legend>
          <input type="text" name="user" defaultValue={initialData.user} />
          {actionData?.errors?.user && actionData.errors.user[0]}
        </fieldset>
        <fieldset>
          <legend>나이</legend>
          <input type="number" name="age" defaultValue={initialData.age} />
          {actionData?.errors?.age && actionData.errors.age[0]}
        </fieldset>
        <fieldset>
          <legend>성별</legend>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              defaultChecked={initialData.gender === "male"}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              defaultChecked={initialData.gender === "female"}
            />
            여성
          </label>
          {actionData?.errors?.gender && actionData.errors.gender[0]}
        </fieldset>
        <fieldset>
          <legend>국가</legend>
          <select name="country" defaultValue={initialData?.country}>
            <option value="">선택해주세요</option>
            <option value="korea">한국</option>
            <option value="use">미국</option>
          </select>
          {actionData?.errors?.country && actionData.errors.country[0]}
        </fieldset>
        <fieldset>
          <legend>약관동의</legend>
          <input
            name="agree"
            type="checkbox"
            value="1"
            defaultChecked={initialData?.agree.includes("1")}
          />
          <input
            name="agree"
            type="checkbox"
            value="2"
            defaultChecked={initialData?.agree.includes("2")}
          />
          {actionData?.errors?.agree && actionData.errors.agree[0]}
        </fieldset>
        <button type="submit">서브밋</button>
        <button type="button" onClick={reset}>
          리셋
        </button>
      </Form>
    </>
  );
};

export default Detail;
