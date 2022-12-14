import Incomes from '../model/Income.js';

export default class IncomeController {
  static async findIncomes(req, res) {
    const { description } = req.query;

    if (description) {
      // find by description
      await Incomes.find({ description }, {}, (err, incomes) => {
        if (err) {
          res.status(400).json({ errors: { msg: err.message } });
        } else if (incomes.length === 0) {
          res.status(404).json({ errors: { msg: 'No description found.' } });
        } else {
          res.status(200).json(incomes);
        }
      }).clone();
    } else {
      // find all incomes
      await Incomes.find((err, incomes) => {
        if (err) {
          res.status(400).send({ errors: { msg: err.message } });
        } else if (incomes.length === 0) {
          res.status(404).send({ errors: { msg: 'No incomes found.' } });
        } else {
          res.status(200).send(incomes);
        }
      }).clone();
    }
  }

  static async findIncomeById(req, res) {
    const { id } = req.params;

    await Incomes.findById(id, (err, income) => {
      if (!err) {
        res.status(200).send(income);
      } else {
        res.status(404).send({ errors: { msg: `${err.message} - "Income" with id:${id} was not found.` } });
      }
    }).clone();
  }

  static findIncomesByMonth(req, res) {
    const { year } = req.params;
    const { month } = req.params;

    // finds all incomes in whith the year and month match the parameters passed
    Incomes.find({
      $and: [
        { $expr: { $eq: [{ $year: '$date' }, String(year)] } },
        { $expr: { $eq: [{ $month: '$date' }, String(month)] } },
      ],
    }, 'description value date', (err, incomes) => {
      if (err) {
        res.status(400).json({ errors: { msg: err.message } });
      } else if (incomes.length === 0) {
        res.status(404).json({ errors: { msg: 'No incomes found on this date.' } });
      } else {
        res.status(200).json(incomes);
      }
    });
  }

  static async createIncome(req, res) {
    const newIncome = new Incomes(req.body);

    newIncome.save((err, income) => {
      if (!err) {
        res.status(201).json({ message: 'Income was added', income });
      } else {
        res.status(422).json({ errors: { msg: err.message } });
      }
    });
  }

  static async updateIncome(req, res) {
    const { id } = req.params;
    const update = req.body;
    const options = { new: true };

    // update an "income"
    Incomes.findByIdAndUpdate(id, update, options, (err, income) => {
      if (!err) {
        res.status(200).json({ message: 'Income updated.', income });
      } else {
        res.status(422).json({ errors: { msg: `${err.message} - Error: income with id:${id} was not updated.` } });
      }
    });
  }

  static async deleteIncome(req, res) {
    const { id } = req.params;

    await Incomes.findByIdAndDelete(id, (err) => {
      if (!err) {
        res.status(200).send({ message: `Income with id:${id} was deleted.` });
      } else {
        res.status(422).send({ errors: { msg: `${err.message} - Error: income with id:${id} was not deleted.` } });
      }
    }).clone();
  }
}
