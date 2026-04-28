"use strict";
import storeDb from '../../database/storeDb.js';

/**
 * Isolated Store Locator Controller (Aligned with Hostinger Schema)
 */

async function getStoreList(req, res) {
  try {
    const { page, limit, StateID, CityID } = req.query;
    const fQuery = {
      include: [
        { model: storeDb.cities, as: 'city', required: false },
        { model: storeDb.states, as: 'state', required: false }
      ],
      where: {},
      order: [['StoreID', 'DESC']]
    };

    if (StateID) fQuery.where.StateID = StateID;
    if (CityID) fQuery.where.CityID = CityID;

    if (page && limit) {
      const pg = Number(page) - 1, lt = Number(limit);
      fQuery.offset = pg * lt;
      fQuery.limit = lt;
      
      const result = await storeDb.stores.findAndCountAll(fQuery);
      return res.status(200).json({
        statusCode: 200,
        data: {
          total_count: result.count,
          list: result.rows
        }
      });
    }

    const stores = await storeDb.stores.findAll(fQuery);
    return res.status(200).json({ statusCode: 200, data: stores });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getStates(req, res) {
  try {
    const states = await storeDb.states.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ statusCode: 200, data: states });
  } catch (error) {
    console.error("Error in getStates:", error);
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getCities(req, res) {
  try {
    const { StateID } = req.query;
    const where = StateID ? { StateID } : {};
    const cities = await storeDb.cities.findAll({ where, order: [['CityName', 'ASC']] });
    return res.status(200).json({ statusCode: 200, data: cities });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getStoreTimings(req, res) {
  try {
    const { storeid } = req.body;
    const data = await storeDb.timings.findOne({ where: { StoreID: storeid } });
    if (!data) return res.status(200).json({ timings: "Timings not available", Closed: "", raw: null });
    
    // Smart Grouping Logic
    const days = [
      { label: 'Mon', val: data.Monday },
      { label: 'Tue', val: data.Tuesday },
      { label: 'Wed', val: data.Wednesday },
      { label: 'Thu', val: data.Thursday },
      { label: 'Fri', val: data.Friday },
      { label: 'Sat', val: data.Saturday },
      { label: 'Sun', val: data.Sunday }
    ];

    const results = [];
    let startDay = days[0];
    let lastDay = days[0];

    for (let i = 1; i < days.length; i++) {
        if (days[i].val === startDay.val) {
            lastDay = days[i];
        } else {
            results.push(startDay.label === lastDay.label ? `${startDay.label}: ${startDay.val}` : `${startDay.label}-${lastDay.label}: ${startDay.val}`);
            startDay = days[i];
            lastDay = days[i];
        }
    }
    results.push(startDay.label === lastDay.label ? `${startDay.label}: ${startDay.val}` : `${startDay.label}-${lastDay.label}: ${startDay.val}`);

    return res.status(200).json({ 
      timings: results, 
      Closed: data.Closed || "",
      raw: data // Send raw for admin panel population
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getRatings(req, res) {
  try {
    const { id } = req.params;
    const ratings = await storeDb.ratings.findAll({ where: { StoreID: id } });
    const count = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = count > 0 ? (sum / count) : 0;

    return res.status(200).json({ 
      ratingCount: count, 
      averageRating: average 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createStore(req, res) {
  try {
    const { StoreName, StoreAdd, StoreLoc, CityID, StateID, timings } = req.body;
    const store = await storeDb.stores.create({
      StoreName, StoreAdd, StoreLoc, CityID, StateID
    });

    if (timings) {
        await storeDb.timings.create({
            StoreID: store.StoreID,
            Monday: timings.Monday || "9 am - 9 pm",
            Tuesday: timings.Tuesday || "9 am - 9 pm",
            Wednesday: timings.Wednesday || "9 am - 9 pm",
            Thursday: timings.Thursday || "9 am - 9 pm",
            Friday: timings.Friday || "9 am - 9 pm",
            Saturday: timings.Saturday || "9 am - 9 pm",
            Sunday: timings.Sunday || "9 am - 9 pm",
            Closed: timings.Closed || ""
        });
    }

    return res.status(201).json({ statusCode: 201, message: "Store created", data: store });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function updateStore(req, res) {
  try {
    const { StoreName, StoreAdd, StoreLoc, CityID, StateID, timings } = req.body;
    await storeDb.stores.update(
      { StoreName, StoreAdd, StoreLoc, CityID, StateID },
      { where: { StoreID: req.params.id } }
    );

    if (timings) {
        const existing = await storeDb.timings.findOne({ where: { StoreID: req.params.id } });
        if (existing) {
            await storeDb.timings.update(timings, { where: { StoreID: req.params.id } });
        } else {
            await storeDb.timings.create({ StoreID: req.params.id, ...timings });
        }
    }

    return res.status(200).json({ statusCode: 200, message: "Store updated" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function deleteStore(req, res) {
  try {
    await storeDb.stores.destroy({ where: { StoreID: req.params.id } });
    await storeDb.timings.destroy({ where: { StoreID: req.params.id } });
    return res.status(200).json({ statusCode: 200, message: "Store deleted" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getDetailedRatings(req, res) {
  try {
    const { id } = req.params;
    const ratings = await storeDb.ratings.findAll({ 
      where: { StoreID: id },
      order: [['submitted_at', 'DESC']]
    });
    return res.status(200).json({ statusCode: 200, data: ratings });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function deleteRating(req, res) {
  try {
    const { storeid, email } = req.body;
    await storeDb.ratings.destroy({ 
      where: { StoreID: storeid, email: email } 
    });
    return res.status(200).json({ statusCode: 200, message: "Rating deleted successfully" });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getStore(req, res) {
  try {
    const store = await storeDb.stores.findOne({ 
      where: { StoreID: req.params.id },
      include: [
        { model: storeDb.cities, as: 'city', required: false },
        { model: storeDb.states, as: 'state', required: false }
      ]
    });
    return res.status(200).json({ statusCode: 200, data: store });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}

async function getStorebyState(req, res) {
  try {
    const { stateid } = req.body; // Actually a state name/search query from the frontend
    if (!stateid) return res.status(200).json([]);

    const { Op } = (await import('sequelize')).default;

    // Find states matching the search text
    const matchingStates = await storeDb.states.findAll({
      where: { name: { [Op.like]: `%${stateid}%` } },
      attributes: ['id']
    });

    if (!matchingStates.length) return res.status(200).json([]);

    const stateIds = matchingStates.map(s => s.id);
    const stores = await storeDb.stores.findAll({
      where: { StateID: { [Op.in]: stateIds } },
      include: [
        { model: storeDb.cities, as: 'city', required: false },
        { model: storeDb.states, as: 'state', required: false }
      ]
    });

    return res.status(200).json(stores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getStorebyname(req, res) {
  try {
    const { cityname } = req.body;
    if (!cityname) return res.status(200).json([]);

    const { Op } = (await import('sequelize')).default;

    // Find cities matching the search text
    const matchingCities = await storeDb.cities.findAll({
      where: { CityName: { [Op.like]: `%${cityname}%` } },
      attributes: ['CityID']
    });

    if (!matchingCities.length) return res.status(200).json([]);

    const cityIds = matchingCities.map(c => c.CityID);
    const stores = await storeDb.stores.findAll({
      where: { CityID: { [Op.in]: cityIds } },
      include: [
        { model: storeDb.cities, as: 'city', required: false },
        { model: storeDb.states, as: 'state', required: false }
      ]
    });

    return res.status(200).json(stores);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { 
  createStore, 
  getStoreList, 
  updateStore, 
  deleteStore, 
  getStore, 
  getStates, 
  getCities, 
  getStoreTimings, 
  getRatings, 
  getDetailedRatings, 
  deleteRating,
  getStorebyState,
  getStorebyname
};
