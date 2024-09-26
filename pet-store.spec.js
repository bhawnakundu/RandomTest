const axios = require("axios");

const BASE_PET_URL = "https://petstore.swagger.io/v2/pet";
const BASE_STORE_URL = "https://petstore.swagger.io/v2/store";
const BASE_USER_URL = "https://petstore.swagger.io/v2/user";

const API_KEY = "special_key";

let newPet = {
  id: 1,
  name: "doggie",
  tags: [
    {
      id: 0,
      name: "some tag 1",
    },
  ],
  status: "available",
};

const newOrder = {
  id: 10,
  petId: 10,
  quantity: 3,
  shipDate: "2024-09-25T13:25:10.521Z",
  status: "placed",
  complete: true,
};

const newUsers = [
  {
    id: 1,
    username: "firstTest",
    firstName: "First",
    lastName: "test",
    email: "firstTest@example.com",
    password: "firstTestPass",
    phone: "040000000",
    userStatus: 0,
  },
  {
    id: 2,
    username: "secondTest",
    firstName: "Second",
    lastName: "test",
    email: "secondTest@example.com",
    password: "secondTestPass",
    phone: "040000000",
    userStatus: 1,
  },
];

describe("PET API Tests", () => {
  test("POST - should create a pet", async () => {
    const payload = newPet;

    const response = await axios.post(BASE_PET_URL, payload);

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(newPet);
  });

  test("PUT - should update a pet", async () => {
    newPet.name = "cat";

    const response = await axios.put(BASE_PET_URL, newPet);

    const expectedResponse = {
      id: 1,
      name: "cat",
      tags: [
        {
          id: 0,
          name: "some tag 1",
        },
      ],
      status: "available",
    };

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(expectedResponse);
  });

  test("GET - should throw 404 when pet with a particualr id doesn't exist", async () => {
    const petId = 2;

    try {
      await axios.get(`${BASE_PET_URL}/${petId}`, {
        headers: { api_key: API_KEY },
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toContain("Pet not found");
    }
  });

  test("GET - should get a pet with a particular id", async () => {
    const petId = 1;

    const response = await axios.get(`${BASE_PET_URL}/${petId}`, {
      headers: { api_key: API_KEY },
    });

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject(newPet);
  });

  test("GET - should get a pet with status provided", async () => {
    const response = await axios.get(`${BASE_PET_URL}/findByStatus`, {
      headers: { api_key: API_KEY },
      params: {
        status: "available",
      },
    });

    expect(response.status).toBe(200);
    response.data.forEach((pet) => {
      expect(pet).toHaveProperty("id");
      expect(pet).toHaveProperty("status", "available");
    });
  });

  test("DELETE - should throw 404 when pet with a particular id doesn't exist", async () => {
    let petId = 2;

    try {
      await axios.delete(`${BASE_PET_URL}/${petId}`, {
        headers: { api_key: API_KEY },
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test("DELETE - should delete the pet with a particular id", async () => {
    const petId = 1;

    const response = await axios.delete(`${BASE_PET_URL}/${petId}`, {
      headers: { api_key: API_KEY },
    });

    expect(response.status).toBe(200);

    // Get pet to check if it was deleted succesfully i.e. doing a GET call should throw 404
    try {
      await axios.get(`${BASE_PET_URL}/${petId}`, {
        headers: { api_key: API_KEY },
      });
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe("PET STORE API Tests", () => {
  test("POST - should create a new order", async () => {
    const payload = newOrder;

    const response = await axios.post(`${BASE_STORE_URL}/order`, payload);

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(newOrder.id);
    expect(response.data.quantity).toBe(newOrder.quantity);
    expect(response.data.status).toBe(newOrder.status);
    expect(response.data.complete).toBe(newOrder.complete);
  });

  test("PUT - should update an order", async () => {
    const payload = {
      id: 10,
      petId: 10,
      quantity: 6,
      shipDate: "2024-09-25T13:25:10.521Z",
      status: "placed",
      complete: true,
    };

    const response = await axios.post(`${BASE_STORE_URL}/order`, payload);

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(newOrder.id);
    expect(response.data.quantity).toBe(payload.quantity);
  });

  test("GET - should get the pet inventory", async () => {
    const response = await axios.get(`${BASE_STORE_URL}/inventory`);

    expect(response.status).toBe(200);
    const expectedStatuses = ["available"];
    expectedStatuses.forEach((status) => {
      expect(response.data).toHaveProperty(status);
    });
  });

  test("GET - should throw 404 when purchase order with particular id doesn't exist", async () => {
    const purchaseId = 6;

    try {
      await axios.get(`${BASE_STORE_URL}/order/${purchaseId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test("GET - should get the order by id", async () => {
    const orderId = 10;

    const response = await axios.get(`${BASE_STORE_URL}/order/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(orderId);
  });

  test("DELETE - should delete the order by id", async () => {
    const orderId = 10;

    const response = await axios.delete(`${BASE_STORE_URL}/order/${orderId}`);

    expect(response.status).toBe(200);

    // Get order to check if it was deleted succesfully i.e. doing a GET call should throw 404
    try {
      await axios.get(`${BASE_STORE_URL}/${orderId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe("USER API Tests", () => {
  test("POST - should create new users", async () => {
    const payload = newUsers;

    const response = await axios.post(
      `${BASE_USER_URL}/createWithList`,
      payload
    );

    expect(response.status).toBe(200);
  });

  test("PUT - should update an user", async () => {
    const userName = "newUserName";

    const payload = {
      id: 2,
      username: "newUserName",
      firstName: "Second",
      lastName: "test",
      email: "secondTest@example.com",
      password: "secondTestPass",
      phone: "040000000",
      userStatus: 1,
    };

    const response = await axios.put(`${BASE_USER_URL}/${userName}`, payload);

    expect(response.status).toBe(200);
  });

  test("GET - should get the user by username", async () => {
    const userName = "firstTest";
    const response = await axios.get(`${BASE_USER_URL}/${userName}`);

    expect(response.status).toBe(200);
    expect(response.data.username).toBe("firstTest");
  });

  test("GET - should throw 404 when user with username doesn't exist", async () => {
    const userName = "random user";

    try {
      await axios.get(`${BASE_USER_URL}/${userName}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toContain("User not found");
    }
  });

  test("DELETE - should delete the user by username", async () => {
    const userName = "firstTest";

    const response = await axios.delete(`${BASE_USER_URL}/${userName}`);

    expect(response.status).toBe(200);
    expect(response.data.message).toBe(userName);

    // Get user to check if it was deleted succesfully i.e. doing a GET call should throw 404
    try {
      await axios.get(`${BASE_USER_URL}/${userName}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test("GET - should return user login when username and password is provided", async () => {
    const userName = "firstTest";
    const password = "firstTestPass";

    const response = await axios.get(
      `${BASE_USER_URL}/login?username=${userName}&password=${password}`
    );
    expect(response.status).toBe(200);
  });
});
