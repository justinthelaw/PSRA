import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

// Components
import { SchemaCollection } from "../../api/schemas";
import { SchemaModal } from "../SchemaModal/SchemaModal.jsx";

// @material-ui
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  description: {
    marginBottom: 25, 
    marginTop: 10
  },
  table: {
    overflow: "auto",
    height: "100%",
  },
  tableNameCol: {
    width: "25%",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      cursor: "pointer"
    },
  },
  spinner: {
    color: theme.palette.text.primary,
  },
  link: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.info.light,
    },
  },
}));

const newSchemaValues = {
  name: "",
  description: "",
  fields: [
    {
      name: "reference",
      description: "",
      type: "string",
      allowedValues: [],
      min: null,
      max: null,
      required: true,
    },
  ],
};

export const SchemasTable = () => {
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);
  const [newSchema, setNewSchema] = useState(true);
  const [initialSchemaValues, setInitialSchemaValues] =
    useState(newSchemaValues);

  const [schemas, isLoading] = useTracker(() => {
    const sub = Meteor.subscribe("schemas");
    const schemas = SchemaCollection.find().fetch();
    return [schemas, !sub.ready()];
  });

  const handleAddNewSchema = () => {
    setNewSchema(true);
    setShowModal(true);
    setInitialSchemaValues(newSchemaValues);
  };

  const handleRowClick = (schemaObject) => {
    setNewSchema(false);
    setShowModal(true);
    setInitialSchemaValues(schemaObject);
  };

  return (

      <div className={classes.root}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs>
            <Typography variant="h3">Schemas</Typography>
          </Grid>
          <Grid container item xs justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewSchema}
            >
              + Add Schema
            </Button>
          </Grid>
        </Grid>
        <Typography gutterBottom variant="body2" className={classes.description}>
          Each <strong>schema</strong> is built to store sets of data that characterize a satellite. 
          Please see the satellites on the{" "} 
          <Tooltip title="Bring me to the schemas page">
            <Link to="/satellites" className={classes.link}>
              previous page
            </Link>
          </Tooltip>{" "}
          for usage examples.
          Each <strong>schema</strong> has a reference for where the data was
          found, a description describing what the data is, and a number of
          data fields that contain the actual information.
          Click on a desired <strong>schema</strong> below to view its details
          and edit the entry fields.
        </Typography>
        <TableContainer component={Paper} className={classes.table}>
          <Table
            size="small"
            aria-label="Schema table"
          >
            <TableHead>
              <TableRow color="secondary">
                <TableCell className={classes.tableNameCol}>
                  <strong>NAME</strong>
                </TableCell>
                <TableCell>
                  <strong>DESCRIPTION</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress className={classes.spinner} />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                schemas.map((schema, i) => (
                  <TableRow
                    key={`schema-row-${i}`}
                    className={classes.tableRow}
                    onClick={() => handleRowClick(schema)}
                  >
                    <TableCell
                      key={`schema-name-${i}`}
                      className={classes.tableNameCol}
                    >
                      {schema.name}
                    </TableCell>
                    <TableCell key={`schema-desc-${i}`}>
                      {schema.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <SchemaModal
          show={showModal}
          newSchema={newSchema}
          initValues={initialSchemaValues}
          handleClose={() => setShowModal(false)}
        />
      </div>
  );
};