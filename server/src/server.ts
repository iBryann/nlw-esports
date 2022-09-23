import express from 'express';
import { PrismaClient } from '@prisma/client';
import { convertHoursStringToMinutes, convertMinutesToHoursString } from './utils/functions';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });

    return response.json(games);
});

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hoursStart: true,
            hoursEnd: true
        },
        where: {
            gameId: gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return response.json(ads.map(ad => ({
        ...ad,
        weekDays: ad.weekDays.split(','),
        hoursEnd: convertMinutesToHoursString(ad.hoursEnd),
        hoursStart: convertMinutesToHoursString(ad.hoursStart)
    })));
});

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hoursStart: convertHoursStringToMinutes(body.hoursStart),
            hoursEnd: convertHoursStringToMinutes(body.hoursEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    });

    return response.status(201).json(ad);
});


app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;
    const ad = await prisma.ad.findUnique({
        where: {
            id: adId
        }
    });

    if (ad) {
        return response.json({ discord: ad.discord });
    }

    return response.status(404).json({
        code: 404,
        message: 'Ad ID not found.'
    });
});

app.listen(3333);