import express from 'express';
import { ValidationError } from './errors/validation-error';
import { UserAlreadyExists } from './errors/user-already-exists';
import { InvalidCarPlate } from './errors/invalid-car-plate';
import { UserWithActiveRide } from './errors/user-with-active-ride';
import { UserNotPassengerError } from './errors/user-not-passenger';
import { NotFoundError } from './errors/not-found';

import { makeRequestRideUseCaseFactory } from './factory/make-request-ride-use-case-factory';
import { makeFetchRideByIdUseCaseFactory } from './factory/make-fetch-ride-by-id-use-case-factory';
import { makeCreateUserUseCaseFactory } from './factory/make-create-user-use-case-factory';
import { makeFetchUserByIdUseCaseFactory } from './factory/make-fetch-user-by-id-use-case-factory';
import { CreateUserInput } from './use-case/create-user-use-case';

const app = express();
app.use(express.json());

app.post('/user', async function (req, res) {
  const body = req.body as CreateUserInput;
  try {
    const createUserUseCase = makeCreateUserUseCaseFactory();
    const response = await createUserUseCase.execute(body);
    return res.status(201).json({ id: response.userId });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof InvalidCarPlate) {
      return res.status(429).json({ message: error.message });
    }
    if (error instanceof UserAlreadyExists) {
      return res.status(409).json({ message: error.message });
    }
  }
});

app.get('/user/:id', async function (req, res) {
  const { id } = req.params as { id: string };
  try {
    const fetchUserByIdUseCase = makeFetchUserByIdUseCaseFactory();
    const response = await fetchUserByIdUseCase.execute(id);
    res.status(200).json(response.user);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

app.get('/ride/:id', async function (req, res) {
  const { id } = req.params as { id: string };
  try {
    const fetchRideUseCase = makeFetchRideByIdUseCaseFactory();
    const response = await fetchRideUseCase.execute({ rideId: id });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/ride', async function (req, res) {
  const { passengerId, from, to } = req.body as any;
  try {
    const requestRideUseCase = makeRequestRideUseCaseFactory();
    const response = await requestRideUseCase.execute({
      from,
      passengerId,
      to,
    });
    res.status(201).json({
      rideId: response.rideId,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (
      error instanceof UserWithActiveRide ||
      error instanceof UserNotPassengerError
    ) {
      return res.status(429).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export { app };
